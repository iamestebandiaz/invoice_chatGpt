import React, { useState, useRef, useEffect, useContext } from 'react';
import ChatMessage from './ChatMessage';
import { ChatContext } from '../context/chatContext';
import Thinking from './Thinking';
import { MdSend } from 'react-icons/md';
import Filter from 'bad-words';
import { sendQuery } from '../utils/communication';
// import Modal from './Modal';
// import Setting from './Setting';

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [flag, setFlag] = useState(0);
  const [shipmentID, setShipmentID] = useState(null);
  const [formValue, setFormValue] = useState('');
  const [thinking, setThinking] = useState(false);
  const options = ['TMS', 'ERP', 'OMS'];
  const [selected, setSelected] = useState(options[0]);
  const [messages, addMessage] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [query_number, setQuery_number] = useState(null);
  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, selected, isLink) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`,
      isLink: isLink
    };
    addMessage(newMsg);
  };
  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e) => {
    e.preventDefault();
    const key = window.localStorage.getItem('api-key');
    const filter = new Filter();
    const cleanPrompt = filter.isProfane(formValue)
      ? filter.clean(formValue)
      : formValue;
    const newMsg = cleanPrompt;
    const apiType = selected;
    setThinking(true);
    setFormValue('');
    updateMessage(newMsg, false, apiType);
    console.log(selected);
    try {
      if (apiType === options[0]) {
        let response = await sendQuery({flag: flag, type: selected, content: cleanPrompt, shipmentID: shipmentID, query_number: query_number});

        let data = response.data.data;
        setFlag(response.data.flag);
        setQuery_number(response.data.query_number);
        setShipmentID(response.data.shipmentID);
        data && updateMessage(data, true, apiType, response.data.isLink);
        setThinking(false);
      }
    } catch (err) {
      window.alert(`Error: ${err} please try again later`);
    }
    setThinking(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // 👇 Get input value
      if(e.target.value != "")
        sendMessage(e);
    }
  };
  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);
  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <div className='chatview'>
      <main className='chatview__chatarea'>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={{ ...message }} />
        ))}
        {thinking && <Thinking/>}
        <span ref={messagesEndRef}></span>
      </main>
      <form className='form' onSubmit={sendMessage}>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className='dropdown'>
          <option>{options[0]}</option>
          <option>{options[1]}</option>
          <option>{options[2]}</option>
        </select>
        <div className='flex items-stretch justify-between w-full'>
          <input
            ref={inputRef}
            className='chatview__textarea-message'
            value={formValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button
            type='submit'
            className='chatview__btn-send'
            disabled={!formValue}>
            <MdSend size={30} />
          </button>
        </div>
      </form>
      {/* <Modal title='Setting' modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal> */}
    </div>
  );
};
export default ChatView;
