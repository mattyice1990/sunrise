(function(){
/* chat.jsx — floating chat widget (bottom-left) */

const CHAT_QUICK = ["Get a free estimate", "Emergency roof leak", "Ask a question"];
function botReply(text) {
  const t = text.toLowerCase();
  if (/(leak|emergency|storm|monsoon|urgent)/.test(t)) return "That sounds urgent — for active leaks call our 24/7 line at 520-753-1758 and we'll get a crew out fast. Want us to schedule an emergency inspection?";
  if (/(estimate|quote|price|cost|how much)/.test(t)) return "Happy to help with a free estimate! What's the property address, and is it residential or commercial? You can also tap \"Free Roof Estimate\" up top to send photos.";
  if (/(metal|tile|shingle|flat|foam|coating)/.test(t)) return "Great choice — we install and repair that system across Tucson. What's the approximate age and size of your roof?";
  if (/(hoa|commercial|property manager|multi)/.test(t)) return "We do a lot of HOA, commercial, and multi-family work with phased scheduling and detailed service logs. What property are we looking at?";
  return "Thanks for reaching out to Sunrise Roofers! A team member will reply shortly. In the meantime, what's going on with your roof?";
}
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [greet, setGreet] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState([{
    from: "bot",
    text: "👋 Hi! Thanks for visiting Sunrise Roofers LLC. How can we help with your roof today?"
  }]);
  const bodyRef = useRef(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing, open]);

  // Hold the widget back until the visitor has scrolled down, then pop it in
  // a few seconds later — feels like a proactive greeting, not an instant nag.
  useEffect(() => {
    let timer;
    const onScroll = () => {
      if (window.scrollY > 400) {
        window.removeEventListener("scroll", onScroll);
        timer = setTimeout(() => setRevealed(true), 3000);
      }
    };
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);
  if (!revealed) return null;
  const send = text => {
    const t = (text == null ? input : text).trim();
    if (!t) return;
    setMsgs(m => [...m, {
      from: "me",
      text: t
    }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, {
        from: "bot",
        text: botReply(t)
      }]);
    }, 1100);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "chat"
  }, open && /*#__PURE__*/React.createElement("div", {
    className: "chat__panel",
    role: "dialog",
    "aria-label": "Chat with Sunrise Roofers"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chat__ava"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "home"
  })), /*#__PURE__*/React.createElement("div", {
    className: "chat__who"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chat__name"
  }, "Sunrise Roofers"), /*#__PURE__*/React.createElement("span", {
    className: "chat__status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "chat__online"
  }), " Online · Replies in minutes")), /*#__PURE__*/React.createElement("button", {
    className: "chat__close",
    onClick: () => setOpen(false),
    "aria-label": "Close chat"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "chat__body",
    ref: bodyRef
  }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "chat__msg chat__msg--" + m.from
  }, m.text)), typing && /*#__PURE__*/React.createElement("div", {
    className: "chat__msg chat__msg--bot chat__typing"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)), msgs.length <= 1 && !typing && /*#__PURE__*/React.createElement("div", {
    className: "chat__quick"
  }, CHAT_QUICK.map(q => /*#__PURE__*/React.createElement("button", {
    key: q,
    className: "chat__chip",
    onClick: () => send(q)
  }, q)))), /*#__PURE__*/React.createElement("form", {
    className: "chat__input",
    onSubmit: e => {
      e.preventDefault();
      send();
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: input,
    onChange: e => setInput(e.target.value),
    placeholder: "Type your message…",
    "aria-label": "Message"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    "aria-label": "Send"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "chat__foot"
  }, "Or call us 24/7 · ", /*#__PURE__*/React.createElement("a", {
    href: "tel:5207531758"
  }, "520-753-1758"))), !open && greet && /*#__PURE__*/React.createElement("div", {
    className: "chat__greet"
  }, /*#__PURE__*/React.createElement("button", {
    className: "chat__greet-x",
    onClick: () => setGreet(false),
    "aria-label": "Dismiss"
  }, "×"), /*#__PURE__*/React.createElement("b", null, "Questions about your roof?"), /*#__PURE__*/React.createElement("span", null, "Message us — we reply fast.")), /*#__PURE__*/React.createElement("button", {
    className: "chat__launch" + (open ? " is-open" : ""),
    onClick: () => {
      setOpen(!open);
      setGreet(false);
    },
    "aria-label": "Open chat"
  }, open ? /*#__PURE__*/React.createElement(Icon, {
    name: "plus"
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "chat"
  }), !open && /*#__PURE__*/React.createElement("span", {
    className: "chat__dot"
  })));
}
Object.assign(window, {
  ChatWidget
});
})();
