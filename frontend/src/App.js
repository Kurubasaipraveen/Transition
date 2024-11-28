import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [checklist, setChecklist] = useState([]);

    useEffect(() => {
        const fetchChecklist = async () => {
            try {
                const response = await fetch('http://localhost:3001/checklist');
                const data = await response.json();
                setChecklist(data);
            } catch (error) {
                console.error("Error fetching checklist:", error);
            }
        };
        fetchChecklist();
    }, []);

    return (
        <div className="App">
            <h1>Checklist Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rule</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {checklist.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td className={item.status.toLowerCase()}>{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;