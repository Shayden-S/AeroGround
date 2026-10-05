import React, {
  useEffect,
  useState
} from 'react';

import {
  Plus
} from 'lucide-react';

import Modal from '../components/common/Modal';

import {
  OpsHeader,
  OpsMetric,
  OpsBadge
} from '../components/common/OperationsUI';

import './OperationsPages.css';


const roles = [
  'Administrator',
  'Operations Manager',
  'Maintenance Supervisor',
  'Technician',
  'Equipment Operator'
];


const blank = {
  name: '',
  role: 'Equipment Operator',
  department: 'Ramp',
  email: '',
  password: '',
  active: true
};


export default function UsersPage() {

  const [users, setUsers] =
    useState([]);

  const [editing, setEditing] =
    useState(null);

  const [form, setForm] =
    useState(blank);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState('');


  // ========================================================
  // LOAD USERS
  // ========================================================

  const loadUsers = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        'http://localhost/aeroground-api/users/get.php'
      );

      const result =
        await response.json();


      if (!result.success) {

        throw new Error(
          result.message ||
          'Unable to load users.'
        );

      }


      setUsers(
        result.data || []
      );


    } catch (error) {

      console.error(
        'User loading error:',
        error
      );

      setMessage(
        'Unable to load users: ' +
        error.message
      );


    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadUsers();

  }, []);


  // ========================================================
  // OPEN USER
  // ========================================================

  const open = user => {

    setMessage('');


    if (user) {

      setEditing(
        user.id
      );

      setForm({
        ...user,
        password: ''
      });

    } else {

      setEditing('new');

      setForm({
        ...blank
      });

    }

  };


  // ========================================================
  // SAVE USER
  // ========================================================

  const submit = async event => {

    event.preventDefault();

    setMessage('');


    try {

      setSaving(true);


      const payload = {

        ...form,

        id:
          editing === 'new'
            ? ''
            : editing

      };


      const response = await fetch(
        'http://localhost/aeroground-api/users/save.php',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(payload)
        }
      );


      const responseText =
        await response.text();


      let result;


      try {

        result =
          JSON.parse(responseText);

      } catch {

        throw new Error(
          'PHP returned an invalid response: ' +
          responseText
        );

      }


      if (!result.success) {

        throw new Error(
          result.message ||
          'Unable to save user.'
        );

      }


      setEditing(null);

      setForm({
        ...blank
      });


      setMessage(
        editing === 'new'
          ? `${result.employeeCode} created successfully.`
          : `${editing} updated successfully.`
      );


      await loadUsers();


    } catch (error) {

      console.error(
        'Save user error:',
        error
      );


      setMessage(
        'Unable to save user: ' +
        error.message
      );


    } finally {

      setSaving(false);

    }

  };


  // ========================================================
  // ACTIVATE / DEACTIVATE
  // ========================================================

  const toggleUser =
    async user => {

      const newActive =
        !user.active;


      try {

        const response = await fetch(
          'http://localhost/aeroground-api/users/toggle.php',
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify({
                id:
                  user.id,

                active:
                  newActive
              })
          }
        );


        const result =
          await response.json();


        if (!result.success) {

          throw new Error(
            result.message ||
            'Unable to update account.'
          );

        }


        setUsers(current =>
          current.map(item =>
            item.id === user.id
              ? {
                  ...item,
                  active:
                    newActive
                }
              : item
          )
        );


        setMessage(
          `${user.id} ${
            newActive
              ? 'activated'
              : 'deactivated'
          }.`
        );


      } catch (error) {

        setMessage(
          'Unable to update user: ' +
          error.message
        );

      }

    };


  // ========================================================
  // PAGE
  // ========================================================

  return (

    <div className="ops-page">

      <OpsHeader
        title="Apron Operators & Personnel Directory"
        subtitle="Manage staff records, operational roles and sign-in accounts."
        action={

          <button
            className="btn-primary"
            onClick={() =>
              open(null)
            }
          >

            <Plus size={15} />

            Add User

          </button>

        }
      />


      {message && (

        <div
          className="ops-toast"
          role="alert"
        >
          {message}
        </div>

      )}


      <div className="ops-metrics">

        <OpsMetric
          label="Total personnel"
          value={users.length}
        />

        <OpsMetric
          label="Active accounts"
          value={
            users.filter(
              user =>
                user.active
            ).length
          }
        />

        <OpsMetric
          label="Technicians"
          value={
            users.filter(
              user =>
                user.role ===
                'Technician'
            ).length
          }
        />

        <OpsMetric
          label="Operators"
          value={
            users.filter(
              user =>
                user.role ===
                'Equipment Operator'
            ).length
          }
        />

      </div>


      <section className="aeroground-card">

        <div className="ops-section-head ops-card">

          <h2>
            Personnel directory
          </h2>

        </div>


        {loading ? (

          <p
            className="ops-muted"
            style={{
              padding: '20px'
            }}
          >
            Loading personnel from MySQL...
          </p>

        ) : (

          <div className="ops-table-wrap">

            <table className="ops-table">

              <thead>

                <tr>

                  <th>Employee ID</th>

                  <th>Name</th>

                  <th>Role</th>

                  <th>Department</th>

                  <th>Email</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                {users.map(user => (

                  <tr key={user.id}>

                    <td>
                      {user.id}
                    </td>


                    <td>

                      <strong>
                        {user.name}
                      </strong>

                    </td>


                    <td>
                      {user.role}
                    </td>


                    <td>
                      {user.department}
                    </td>


                    <td>
                      {user.email}
                    </td>


                    <td>

                      <OpsBadge
                        text={
                          user.active
                            ? 'Active'
                            : 'Inactive'
                        }
                        tone={
                          user.active
                            ? 'green'
                            : 'red'
                        }
                      />

                    </td>


                    <td>

                      <button
                        className="ops-link"
                        onClick={() =>
                          open(user)
                        }
                      >
                        Edit
                      </button>

                      {' · '}

                      <button
                        className="ops-link"
                        onClick={() =>
                          toggleUser(
                            user
                          )
                        }
                      >

                        {
                          user.active
                            ? 'Deactivate'
                            : 'Activate'
                        }

                      </button>

                    </td>

                  </tr>

                ))}


                {!users.length && (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign:
                          'center',
                        padding:
                          '30px'
                      }}
                    >
                      No personnel records found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      <p className="ops-muted">

        Personnel records and sign-in accounts
        are stored in the AeroGround MySQL
        database.

      </p>


      {/* USER MODAL */}

      <Modal
        isOpen={!!editing}
        onClose={() =>
          setEditing(null)
        }
        title={
          editing === 'new'
            ? 'Add user'
            : `Edit ${editing}`
        }
        maxWidth="560px"
      >

        <form
          className="ops-form"
          onSubmit={submit}
        >


          <label className="ops-field">

            Name

            <input
              className="form-input"
              required
              maxLength={100}
              value={form.name}
              onChange={
                event =>
                  setForm({
                    ...form,
                    name:
                      event.target.value
                  })
              }
            />

          </label>


          <label className="ops-field">

            Role

            <select
              className="form-input"
              value={form.role}
              onChange={
                event =>
                  setForm({
                    ...form,
                    role:
                      event.target.value
                  })
              }
            >

              {roles.map(role => (

                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>

              ))}

            </select>

          </label>


          <label className="ops-field">

            Department

            <input
              className="form-input"
              required
              maxLength={100}
              value={
                form.department
              }
              onChange={
                event =>
                  setForm({
                    ...form,
                    department:
                      event.target.value
                  })
              }
            />

          </label>


          <label className="ops-field">

            Email

            <input
              className="form-input"
              required
              type="email"
              maxLength={150}
              value={form.email}
              onChange={
                event =>
                  setForm({
                    ...form,
                    email:
                      event.target.value
                  })
              }
            />

          </label>


          <label className="ops-field full">

            {
              editing === 'new'
                ? 'Password'
                : 'New password (leave blank to keep current password)'
            }

            <input
              className="form-input"
              type="password"
              required={
                editing === 'new'
              }
              minLength={6}
              maxLength={100}
              value={
                form.password ||
                ''
              }
              onChange={
                event =>
                  setForm({
                    ...form,
                    password:
                      event.target.value
                  })
              }
            />

          </label>


          <div className="ops-form-actions">

            <button
              type="button"
              className="btn-secondary"
              disabled={saving}
              onClick={() =>
                setEditing(null)
              }
            >
              Cancel
            </button>


            <button
              className="btn-primary"
              type="submit"
              disabled={saving}
            >

              {
                saving
                  ? 'Saving...'
                  : 'Save user'
              }

            </button>

          </div>

        </form>

      </Modal>

    </div>

  );

}