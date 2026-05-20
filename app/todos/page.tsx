"use client";

import { useEffect, useState } from "react";
import { Todo } from "../generated/prisma/client";

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      });
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
