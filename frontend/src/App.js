import React, { useEffect, useState } from 'react';
import axios from "axios";
import { API_URL } from "./constants";

function App() {
    // Definicja stanów komponentu
    const [notes, setNotes] = useState([]); // Stan notatek
    const [newNote, setNewNote] = useState({ note_text: "", username: "" }); // Nowa notatka

    const [users, setUsers] = useState([]); // Stan użytkowników
    const [newUser, setNewUser] = useState({ pk: "", username: "", password: "" }); // Nowy użytkownik
    const [selectedUser, setSelectedUser] = useState({ pk: "", username: "", password: "" }); // Wybrany użytkownik

    const [loginData, setLoginData] = useState({ username: "", password: "" }); // Dane logowania

    const [loggedInUser, setLoggedInUser] = useState(null); // Zalogowany użytkownik

    // Obsługa zmiany stanu nowego użytkownika
    const onUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Obsługa zmiany stanu nowej notatki
    const onNoteChange = (e) => {
        const { name, value } = e.target;
        setNewNote((prevNote) => ({
            ...prevNote,
            [name]: value,
        }));
    };

    // Obsługa zmiany stanu danych logowania
    const onLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Obsługa wyboru użytkownika
    const onUserSelect = (e) => {
        const name = e;
        const user = users.find((user) => user.username === name);
        setSelectedUser(user);
        onNoteChange({ target: { name: "username", value: user.username } });
    };

    // Dodawanie nowej notatki
    const addNote = async () => {
        const foundUser = users.find(
            (user) =>
                user.username === loginData.username &&
                user.password === loginData.password
        );
    
        if (newNote.note_text.trim() !== "" && foundUser.username.trim() !== "") {
            console.log(
                "text: " +
                newNote.note_text +
                ", username: " +
                newNote.username +
                ", owner: " +
                foundUser.username
            );
    
            // Wysłanie nowej notatki na serwer
            axios.post(API_URL + "create-note", {
                note_text: newNote.note_text,
                owner: foundUser.username,
            });
    
            // Natychmiast dodaj notatkę do stanu aplikacji
            setNotes([...notes, newNote]);
    
            // Zresetuj stan nowej notatki
            setNewNote({ note_text: "", username: newNote.username });
        }
    };
    
    
    

    // Dodawanie nowego użytkownika
    const addUser = () => {
        if (newUser.username.trim() !== "" && newUser.password.trim() !== "") {
            // Wysłanie nowego użytkownika na serwer
            axios.post(API_URL + "create-user", newUser);
            setUsers([...users, newUser]); // Dodanie nowego użytkownika do listy użytkowników
            setNewUser({ pk: "", username: "", password: "" }); // Resetowanie pól nowego użytkownika
        }
    };

    // Logowanie użytkownika
    const login = () => {
        if (loginData.username.trim() !== "" && loginData.password.trim() !== "") {
            // Znalezienie użytkownika o podanych danych logowania
            const foundUser = users.find(
                (user) =>
                    user.username === loginData.username &&
                    user.password === loginData.password
            );
    
            if (foundUser) {
                setLoggedInUser(foundUser); // Ustawienie zalogowanego użytkownika
                console.log("Zalogowano jako: " + foundUser.username);
            } else {
                console.log("Błąd logowania: Nieprawidłowy login lub hasło.");
            }
        }
    };

    // Wylogowanie użytkownika
    const logout = () => {
        setLoggedInUser(null);
    };

    // Efekt pobierania danych z serwera przy pierwszym renderowaniu komponentu
    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get(API_URL + "users");
                const notesResponse = await axios.get(API_URL + "notes");

                // Zakładając, że oba żądania były udane
                const usersData = usersResponse.data;
                const notesData = notesResponse.data;

                // Mapowanie notatek na nazwy użytkowników
                const notesWithUsernames = notesData.map((note) => {
                    const user = usersData.find((user) => user.pk === note.owner);
                    return { ...note, username: user.username };
                });

                setUsers(usersData); // Ustawienie stanu użytkowników
                setNotes(notesWithUsernames); // Ustawienie stanu notatek
            } catch (error) {
                console.error("Błąd podczas pobierania danych:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Notes App</h1>
            <div>
                {/* Formularz dodawania nowego użytkownika */}
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
                <button onClick={addUser}>Dodaj użytkownika</button>
            </div>
            <div>
                {/* Formularz dodawania nowej notatki */}
                {loggedInUser ? (
            <div>
            <input
                type="text"
                placeholder="Dodaj nową notatkę"
                name="note_text"
                value={newNote.note_text}
                onChange={(e) => onNoteChange(e)}
            />
                <button onClick={addNote}>Dodaj notatkę</button>
                </div>
                ) : null}

            </div>
            <div>
                {loggedInUser ? (
                    // Komunikat o zalogowanym użytkowniku i przycisk wylogowania
                    <div>
                        <p>Zalogowano jako: {loggedInUser.username}</p>
                        <button onClick={logout}>Wyloguj się</button>
                    </div>
                ) : (
                    // Formularz logowania
                    <div>
                        <input
                            type="text"
                            placeholder="Login"
                            name="username"
                            value={loginData.username}
                            onChange={(e) => onLoginChange(e)}
                        />
                        <input
                            type="password"
                            placeholder="Hasło"
                            name="password"
                            value={loginData.password}
                            onChange={(e) => onLoginChange(e)}
                        />
                        <button onClick={login}>Zaloguj się</button>
                    </div>
                )}
            </div>
            <h3>Notatki użytkownika: {loggedInUser ? loggedInUser.username : "Brak zalogowanego użytkownika"}</h3>
            <ul>
                {/* Wyświetlanie notatek użytkownika po zalogowaniu */}
                {notes
                    .filter((note) => loggedInUser && note.owner === loggedInUser.pk)
                    .map((note, index) => (
                        <li key={index}>
                            <div>
                                <span>Użytkownik: {note.username}</span>
                                <br />
                                <span>Notatka: {note.note_text}</span>
                            </div>
                        </li>
                    ))}
            </ul>

            <h3>Użytkownicy</h3>
            <ul>
                {/* Wyświetlanie listy użytkowników */}
                {users.map((user, index) => (
                    <li key={index}>
                        <div>
                            <span>Użytkownik: </span>
                            {user.username}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
