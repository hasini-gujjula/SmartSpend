import { useState } from "react";

function EditExpense({ expense, onExpenseUpdated, onCancel }) {
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [description, setDescription] = useState(expense.description || "");
  const [expenseDate, setExpenseDate] = useState(expense.expenseDate);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8081/api/expenses/${expense.id}`,
        {
          method: "PUT",
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
          setMessage(data.message || "Failed to update expense");
        }
        return;
      }

      setMessage("Expense updated successfully!");

      if (onExpenseUpdated) {
        onExpenseUpdated();
      }
    } catch (error) {
      setMessage("Unable to connect to the server");
    }
  };

  return (
    <div>
      <h2>Edit Expense</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

        <button type="submit">Update Expense</button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default EditExpense;
