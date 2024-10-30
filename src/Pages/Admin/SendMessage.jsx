
import { useState, useEffect } from 'react';
import { db } from '../../Firebase/Config';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Layout from '../../Components/Layout';
import { useStateContext } from '../../Contexts/ContextProvider';

const SendMessage = () => {
  const { currentColor } = useStateContext();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);

  const sendMessageToStudents = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      // Fetch all student email IDs from studentData collection
      const studentCollection = collection(db, 'studentData');
      const studentSnapshot = await getDocs(studentCollection);
      const studentEmails = studentSnapshot.docs.map(doc => doc.data().email);

      // Add the message to the messages collection
      const messagesCollection = collection(db, 'messages');
      await addDoc(messagesCollection, {
        message,
        students: studentEmails,
        timestamp: new Date(),
      });

      console.log('Message sent successfully!');
      setMessage(''); // Clear the message input
      fetchSentMessages(); // Refresh the list of sent messages
    } catch (error) {
      console.error('Error sending message: ', error);
      console.log('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const fetchSentMessages = async () => {
    const messagesCollection = collection(db, 'messages');
    const messageSnapshot = await getDocs(messagesCollection);
    const messageList = messageSnapshot.docs.map(doc => doc.data());
    setSentMessages(messageList);
  };

  useEffect(() => {
    fetchSentMessages();
  }, []);

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg flex flex-col lg:flex-row gap-5">
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Send Message to All Students</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
          />
          <button
            onClick={sendMessageToStudents}
            style={{ backgroundColor: currentColor }}
            className="mt-4 w-full text-white py-2 rounded-lg  transition-colors"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>

        </div>
        <div className="max-h-[500px] p-5">
        <h2 className="text-2xl font-semibold mb-4">Sent Messages</h2>
          <div className="mt-4 h-full overflow-scroll">
            {sentMessages.length > 0 ? (
              sentMessages.map((msg, index) => (
                <div key={index} className="p-4 mb-4 bg-gray-100 rounded-lg">
                  <p>{msg.message}</p>
                  <small className="text-gray-600">
                    Sent to {msg.students.length} students on {msg.timestamp.toDate().toLocaleString()}
                  </small>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No messages sent yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SendMessage;
