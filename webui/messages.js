
var msgThreads;
var activeMsgThreadDom;
var activeMsgThread;
var threadUpdater;
var threadsUpdater;

function createThreadPreview(thread) {
  var lastMessage = thread.messages[thread.messages.length - 1];
  var preview = lastMessage.msg;
  if (lastMessage.sender == 'BUSINESS') preview = 'You: ' + preview;
  if (preview.length > 30) preview = preview.slice(0, 30) + "...";

  return `
    <p>${thread.sender}</p>
    <p>${preview}</p>
  `;
}

function updateThreadView(scrollToBottom) {
  var html = "";

  for (var m of activeMsgThread.messages) {
    html += `
      <div class="${m.sender == 'BUSINESS' ? "msg-me" : "msg-other"}">
        <p>${m.msg}</p>
      </div>
    `;
  }

  var el = document.getElementById("messages");
  el.innerHTML = html;
  if (scrollToBottom) {
    el.scrollTo(0, el.scrollHeight);
  }
  activeMsgThreadDom.innerHTML = createThreadPreview(activeMsgThread);
}

function loadMoreMessages(data) {
  if (data) {
    if (data.length > 0 && data[data.length - 1].index < activeMsgThread.messages[0].index) {
      activeMsgThread.messages = data.concat(activeMsgThread.messages);
      updateThreadView();
    }
  }
  else {
    var firstIndex = activeMsgThread.messages[0].index;
    if (firstIndex > 0) {
      var id = activeMsgThread.id;

      GraphQL.query(`
        query ($threadId: ID, $maxIndex: Int) {
          user {
            threads(threadId: $threadId) {
              messages(maxIndex: $maxIndex) {
                index
                msg
                time
                sender
              }
            }
          }
        }
      `, {
        threadId: id,
        maxIndex: firstIndex
      }).then(res => {
        if (! res.hasError && activeMsgThread.id == id) {
          loadMoreMessages(res.data["user"]["threads"][0]["messages"]);
        }
      });  
    }
  }
}

function updateThread(data) {
  if (data) {
    if (data.length > 0 && data[0].index > activeMsgThread.messages[activeMsgThread.messages.length - 1].index) {
      activeMsgThread.messages = activeMsgThread.messages.concat(data);
      updateThreadView(true);
    }
  }
  else {
    var id = activeMsgThread.id;

    GraphQL.query(`
      query ($threadId: ID, $minIndex: Int) {
        user {
          threads(threadId: $threadId) {
            messages(minIndex: $minIndex) {
              index
              msg
              time
              sender
            }
          }
        }
      }
    `, {
      threadId: id,
      minIndex: activeMsgThread.messages[activeMsgThread.messages.length - 1].index
    }).then(res => {
      if (! res.hasError && activeMsgThread.id == id) {
        updateThread(res.data["user"]["threads"][0]["messages"]);
      }
    });
  }
}

function sendMessage(msg) {

  var id = activeMsgThread.id;

  GraphQL.mutation(`
    mutation ($msg: String!, $threadId: ID!, $minIndex: Int) {
      sendMessage(msg: $msg, threadId: $threadId) {
        messages(minIndex: $minIndex) {
          index
          msg
          time
          sender
        }
      }
    }
  `, {
    msg: msg,
    threadId: activeMsgThread.id,
    minIndex: activeMsgThread.messages[activeMsgThread.messages.length - 1].index
  }).then(res => {
    if (! res.hasError && activeMsgThread.id == id) {
      updateThread(res.data["sendMessage"]["messages"]);
    }
  });
}

function selectThread(el, id) {
  if (threadUpdater) clearInterval(threadUpdater);

  if (activeMsgThreadDom) $(activeMsgThreadDom).removeClass('active');
  $(el).addClass('active');

  activeMsgThread = msgThreads.get(id);
  activeMsgThreadDom = el;

  $("#thread-view").show();
  updateThreadView(true);

  updateThread();
  threadUpdater = setInterval(updateThread, 10000);
}

function updateThreads() {
  GraphQL.query(`
    query {
      user {
        threads {
          id
          sender
          messages {
            index
            msg
            time
            sender
          }
        }
      }
    }
  `).then((res) => {
    msgThreads = new Map();

    if (! res.hasError) {
      for (var thread of res.data["user"]["threads"]) {
        msgThreads.set(thread.id, thread);
      }
    }

    var orderedThreads =
      Array.from(msgThreads.values())
        .sort((a, b) =>
          parseInt(b.messages[b.messages.length - 1].time) 
          - parseInt(a.messages[a.messages.length - 1].time)
        );
    var html = "";
    for (var thread of orderedThreads) {
      html += `
        <div
          class="thread-title ${(activeMsgThread && activeMsgThread.id == thread.id) ? "active" : ""}"
          onclick="selectThread(this, '${thread.id}')"
        >${createThreadPreview(thread)}</div>
      `;
    }
    document.getElementById("threads").innerHTML = html;
  });
}

$(document).ready(function() {
  updateThreads();
  threadsUpdater = setInterval(updateThreads, 60000);

  document.getElementById("messages").onscroll = function (e) {
    if (e.target.scrollTop == 0) {
      loadMoreMessages();
    }
  }

  DynamicLoader.beforeUnload('content', () => {
    if (threadsUpdater) clearInterval(threadsUpdater);
    if (threadUpdater) clearInterval(threadUpdater);
  });
});
