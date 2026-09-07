import { useState } from "react";

function AddExpense({ onExpenseAdded }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8081/api/expenses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            amount: Number(amount),
            category,
            description,
            expenseDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setMessage(Object.values(data.errors).join(", "));
        } else {
          setMessage(data.message || "Failed to add expense");
        }
        return;
      }

      setMessage("Expense added successfully!");

      setTitle("");
      setAmount("");
      setCategory("");
      setDescription("");
      setExpenseDate("");

      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      setMessage("Unable to connect to the server");
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Expense title"
            required
          />
        </div>

        <br />

        <div>
          <label>Amount</label>
          <br />
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>

        <br />

        <div>
          <label>Category</label>
          <br />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Food, Travel, Shopping..."
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <br />

        <div>
          <label>Date</label>
          <br />
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">Add Expense</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AddExpense;