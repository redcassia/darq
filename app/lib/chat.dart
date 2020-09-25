import 'dart:collection';

import 'package:darq/backend.dart';
import 'package:graphql/client.dart';

class Message {
  final String sender;
  final DateTime time;
  final int index;
  final String msg;

  Message(this.sender, String time, this.index, this.msg)
      : time = DateTime.fromMillisecondsSinceEpoch(int.parse(time));
}

class MessageThread {
  String id;
  String targetId;
  String targetName;
  String targetPicture;
  List<Message> messages;

  MessageThread(dynamic thread) {
    id = thread["id"];
    targetId = thread["target"]["id"];
    targetName = thread["target"]["display_name"];
    targetPicture = thread["target"]["display_picture"];
    messages = _createMessagesFromResponse(thread["messages"]);
  }
  List<Message> _createMessagesFromResponse(dynamic messages) {
    List<Message> list = new List();
    for (var m in messages) {
      list.add(Message(m["sender"], m["time"], m["index"], m["msg"]));
    }
    return list;
  }

  void addMessagesTop(dynamic newMessages) {
    messages.insertAll(0, _createMessagesFromResponse(newMessages));
  }

  void addMessagesBottom(dynamic newMessages) {
    messages.addAll(_createMessagesFromResponse(newMessages));
  }
}

class Chat {
  HashMap<String, MessageThread> _threads;
  HashMap<String, MessageThread> _threadsByBusiness;
  _init() async {
    var client = await Backend.getClient();
    var result = await client.query(QueryOptions(documentNode: gql('''
      query{
        user{
          threads{
            id
            target{
              id
              display_name
              display_picture
            }
            messages{
              sender
              time
              index
              msg
            }
          }
        }
      }
      ''')));
    if (result.hasException)
      throw Exception("Failed to initialize message threads");
    if (_threads == null) _threads = new HashMap();
    if (_threadsByBusiness == null) _threadsByBusiness = new HashMap();
    for (var t in result.data["user"]["threads"]) {
      _threads.putIfAbsent(t["id"], () => MessageThread(t));
      _threadsByBusiness.putIfAbsent(t["target"]["id"], () => MessageThread(t));
    }
  }

  Future<MessageThread> getThread({String threadId, String businessId}) async {
    if (threadId != null) {
      if (_threads == null) await _init();
      if (_threads.containsKey(threadId)) {
        return _threads[threadId];
      } else {
        throw Exception("Invalid thread id");
      }
    } else if (businessId != null) {
      if (_threadsByBusiness == null) await _init();
      if (_threadsByBusiness.containsKey(businessId)) {
        return _threadsByBusiness[businessId];
      } else {
        throw Exception("Invalid business id");
      }
    } else {
      return null;
    }
  }

  Future<List<MessageThread>> getThreads() async {
    if (_threads == null) await _init();
    var sortedThreads = _threads.values.toList();
    sortedThreads.sort(
        (a, b) => a.messages.last.time.compareTo(b.messages.last.time) * -1);
    return sortedThreads;
  }

  Future<MessageThread> loadMore(String threadId) async {
    var thread = await getThread(threadId: threadId);
    var client = await Backend.getClient();
    var result = await client.query(QueryOptions(documentNode: gql(r'''
      query ($threadId: ID!, $maxIndex: Int!){
        user{
          threads(threadId: $threadId) {
            messages(maxIndex: $maxIndex) {
              sender
              time
              index
              msg
            }
          }
        }
      }
      '''), variables: {
      "threadId": thread.id,
      "maxIndex": thread.messages.first.index
    }));
    if (result.hasException) {
      throw Exception("Failed to load more messages for thread ${thread.id}");
    }
    thread.addMessagesTop(result.data["user"]["threads"][0]["messages"]);
    _threads.update(thread.id, (_) => thread);
    _threadsByBusiness.update(thread.targetId, (_) => thread);
    return thread;
  }

  Future<MessageThread> sendMessage(String message,
      {String threadId, String businessId}) async {
    var client = await Backend.getClient();

    if (threadId != null) {
      var thread = await getThread(threadId: threadId);
      var result = await client.mutate(MutationOptions(documentNode: gql(r'''
        mutation ($msg: String!, $threadId: ID!, $minIndex: Int!){
          sendMessage(msg: $msg, threadId: $threadId) {
            messages(minIndex: $minIndex) {
              sender
              time
              index
              msg
            }
          }
        }
      '''), variables: {
        "msg": message,
        "threadId": thread.id,
        "minIndex": thread.messages.last.index
      }));
      if (result.hasException) {
        throw Exception("Failed to send message in thread ${thread.id}");
      }
      thread.addMessagesBottom(result.data["sendMessage"]["messages"]);
      _threads.update(thread.id, (_) => thread);
      _threadsByBusiness.update(thread.targetId, (_) => thread);
      return thread;
    } else if (businessId != null) {
      if (_threads == null) await _init();
      var result = await client.mutate(MutationOptions(documentNode: gql(r'''
        mutation ($msg: String!, $targetBusinessId: ID!){
          sendMessage(msg: $msg, targetBusinessId: $targetBusinessId) {
            id
            target{
              id
              display_name
              display_picture
            }
            messages{
              sender
              time
              index
              msg
            }
          }
        }
      '''), variables: {"msg": message, "targetBusinessId": businessId}));
      if (result.hasException) {
        throw Exception("Failed to send message to business $businessId");
      }
      _threads.putIfAbsent(result.data["sendMessage"]["id"],
          () => MessageThread(result.data["sendMessage"]));
      _threadsByBusiness.putIfAbsent(result.data["sendMessage"]["id"],
          () => MessageThread(result.data["sendMessage"]));
      return _threads[result.data["sendMessage"]["id"]];
    } else {
      return null;
    }
  }

  static final Chat _singleton = new Chat._internal();

  factory Chat() {
    return _singleton;
  }

  Chat._internal();
}
