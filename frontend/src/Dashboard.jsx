import { useEffect, useState } from "react";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [highestExpense, setHighestExpense] = useState(0);
  const [mostUsedCategory, setMostUsedCategory] = useState("None");

  useEffect(() => {
    fetchExpenses();
  }, [page, search, category]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8081/api/expenses?search=${encodeURIComponent(
          search
        )}&category=${encodeURIComponent(
          category
        )}&page=${page}&size=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        setMessage("Session expired. Please login again.");
        return;
      }

      if (!response.ok) {
        setMessage("Unable to load expenses");
        return;
      }

      const data = await response.json();

      setExpenses(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      setMessage("Unable to connect to the server");
    }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8081/api/expenses/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        return;
      }

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setTotalAmount(data.totalAmount ?? 0);
      setTotalTransactions(data.totalTransactions ?? 0);
      setHighestExpense(data.highestExpense ?? 0);
      setMostUsedCategory(data.mostUsedCategory || "None");
    } catch (error) {
      console.log("Unable to load statistics");
    }
  };

  const handleExpenseAdded = () => {
    setMessage("Expense added successfully!");

    fetchExpenses();
    fetchStats();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8081/api/expenses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        setMessage("Session expired. Please login again.");
        return;
      }

      if (!response.ok) {
        setMessage("Unable to delete expense");
        return;
      }

      setMessage("Expense deleted successfully!");

      fetchExpenses();
      fetchStats();
    } catch (error) {
      setMessage("Unable to connect to the server");
    }
  };

  const handleExpenseUpdated = () => {
    setEditingExpense(null);
    setMessage("Expense updated successfully!");

    fetchExpenses();
    fetchStats();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="dashboard">

      <header className="dashboard-header">

        <div className="brand">
          <h1>SmartSpend</h1>
          <p>Track your expenses. Manage your money.</p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      <main className="dashboard-content">

        {/* SUMMARY CARDS */}

        <div className="summary-card">

          <div className="summary-box">
            <p>Total Spending</p>
            <h2>
              ₹{Number(totalAmount).toFixed(2)}
            </h2>
          </div>

          <div className="summary-box">
            <p>Total Transactions</p>
            <h2>
              {totalTransactions}
            </h2>
          </div>

          <div className="summary-box">
            <p>Highest Expense</p>
            <h2>
              ₹{Number(highestExpense).toFixed(2)}
            </h2>
          </div>

          <div className="summary-box">
            <p>Top Category</p>
            <h2>
              {mostUsedCategory}
            </h2>
          </div>

        </div>

        {/* ADD EXPENSE */}

        <section className="form-card">

          <AddExpense
            onExpenseAdded={handleExpenseAdded}
          />

        </section>

        {/* EXPENSES */}

        <section className="expenses-card">

          <h2>My Expenses</h2>

          {/* SEARCH AND FILTER */}

          <div className="filter-section">

            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(0);
              }}
            >

              <option value="">
                All Categories
              </option>

              <option value="Food">
                Food
              </option>

              <option value="Travel">
                Travel
              </option>

              <option value="Shopping">
                Shopping
              </option>

              <option value="Bills">
                Bills
              </option>

              <option value="Entertainment">
                Entertainment
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* MESSAGE */}

          {message && (
            <p className="message">
              {message}
            </p>
          )}

          {/* EXPENSE LIST */}

          {expenses.length === 0 ? (

            <p className="empty-message">
              No expenses found.
            </p>

          ) : (

            expenses.map((expense) => (

              <div
                className="expense-item"
                key={expense.id}
              >

                <div className="expense-info">

                  <h3>
                    {expense.title}
                  </h3>

                  <span className="expense-category">
                    {expense.category}
                  </span>

                  {expense.description && (
                    <p className="expense-description">
                      {expense.description}
                    </p>
                  )}

                  <p className="expense-date">
                    {expense.expenseDate}
                  </p>

                </div>

                <div className="expense-right">

                  <strong>
                    ₹{Number(expense.amount).toFixed(2)}
                  </strong>

                  <div className="expense-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        setEditingExpense(expense)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(expense.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))

          )}

          {/* PAGINATION */}

          {totalPages > 1 && (

            <div className="pagination">

              <button
                disabled={page === 0}
                onClick={() =>
                  setPage(page - 1)
                }
              >
                Previous
              </button>

              <span>
                Page {page + 1} of {totalPages}
              </span>

              <button
                disabled={
                  page === totalPages - 1
                }
                onClick={() =>
                  setPage(page + 1)
                }
              >
                Next
              </button>

            </div>

          )}

        </section>

      </main>

      {/* EDIT MODAL */}

      {editingExpense && (

        <div className="edit-overlay">

          <div className="edit-modal">

            <EditExpense
              expense={editingExpense}

              onExpenseUpdated={
                handleExpenseUpdated
              }

              onCancel={() =>
                setEditingExpense(null)
              }
            />

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;