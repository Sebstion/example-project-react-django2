import React, {useState} from 'react';

function App() {

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({text: "", username: ""});

    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({username: "", password: ""});
    const [selectedUser, setSelectedUser] = useState({username: "", password: ""});

    const onUserChange = e => {
        const {name, value} = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const onNoteChange = e => {
        const {name, value} = e.target;
        setNewNote((prevNote) => ({
            ...prevNote,
            [name]: value
        }));
    }

    const onUserSelect = e => {
        const name = e;
        const user = users.find(user => user.username === name);
        setSelectedUser(user);
        onNoteChange({target: {name: "username", value: user.username}});
    }

    const addNote = () => {
        if (newNote.text.trim() !== '' && newNote.username.trim() !== '') {
            setNotes([...notes, newNote]);
            setNewNote({text: "", username: newNote.username});
        }
    };

    const addUser = () => {
        if (newUser.username.trim() !== '' && newUser.password.trim() !== '') {
            setUsers([...users, newUser]);
            setNewUser({username: "", password: ""});
        }
    };

    const removeNote = (index) => {
        const updatedNotes = [...notes];
        updatedNotes.splice(index, 1);
        setNotes(updatedNotes);
    };

    return (
        <div>
            <h1>Notes App</h1>
            <div>
                <input
                    type="text"
                    placeholder="username"
                    name="username"
                    value={newUser.username}
                    onChange={(e) => onUserChange(e)}
                />
                <input
                    type="password"
                    placeholder="password"
                    name="password"
                    value={newUser.password}
                    onChange={(e) => onUserChange(e)}
                />
                <button onClick={addUser}>Add</button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Add a new note"
                    name="text"
                    value={newNote.text}
                    onChange={(e) => onNoteChange(e)}
                />
                <select value={selectedUser.username} onChange={(e) => onUserSelect(e.target.value)}>
                    <option value="">Select User</option>
                    {users.map((user, index) => (
                        <option key={index} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </select>
                <button onClick={addNote}>Add</button>
            </div>
            <h3>Notes</h3>
            <ul>
                {notes.map((note, index) => (
                    <li key={index}>
                        <div>
                            <span>Username: </span>
                            {note.username}
                            <br />
                            <span>Note: </span>
                            {note.text}
                        </div>
                        <button onClick={() => removeNote(index)}>Delete</button>
                    </li>
                ))}
            </ul>
            <h3>Users</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        <div>
                            <span>Username: </span>
                            {user.username}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
