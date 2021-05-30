﻿import React, { useState } from 'react';

const NewTaskInput = ({ onSubmit }) => {

    const [newItem, setNewItem] = useState('');
    const [newItem1, setNewItem1] = useState(0);

    function setNewTask(event) {
        setNewItem(event.target.value);
    }

    function setNewTask1(event) {
        setNewItem1(event.target.value);
    }

    function submit(e) {
        e.preventDefault();
        console.log(newItem);
        console.log(newItem1);
        onSubmit(newItem, newItem1);
    }

    return (
        <div className="flex content-center items-center justify-center">
            <form onSubmit={submit}>
                <input
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 -mb-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Nome do metadado"
                    type='text'
                    onChange={setNewTask}
                />
                <br />
                <input
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 -mb-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholder="Atributo"
                    type='text'
                    onChange={setNewTask1}
                />
                <br />
                <button className="bg-blue-500 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none w-auto" type="submit">
                    Adicionar
                </button>
            </form>
        </div>
    )
};

export default NewTaskInput;