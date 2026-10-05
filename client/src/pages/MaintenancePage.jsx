import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  Plus,
  Wrench
} from 'lucide-react';

import Modal from '../components/common/Modal';

import {
  OpsHeader,
  OpsMetric,
  OpsBadge
} from '../components/common/OperationsUI';

import './OperationsPages.css';


const today =
  new Date().toISOString().slice(0, 10);


const stages = [
  'Created',
  'Assigned',
  'In Progress',
  'Inspection',
  'Completed'
];


const EMPTY_FORM = {

  equipmentId: '',

  type:
    'Corrective',

  priority:
    'Medium',

  technician:
    '',

  scheduled:
    '',

  problem:
    '',

  faultId:
    '',

  notes:
    ''

};


export default function MaintenancePage() {

  // ========================================================
  // STATE
  // ========================================================

  const [orders, setOrders] =
    useState([]);

  const [equipmentList, setEquipmentList] =
    useState([]);

  const [faults, setFaults] =
    useState([]);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [open, setOpen] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState(null);

  const [filter, setFilter] =
    useState('All');

  const [message, setMessage] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // ========================================================
  // LOAD MYSQL DATA
  // ========================================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);


        const [
          ordersResponse,
          equipmentResponse,
          faultsResponse
        ] = await Promise.all([

          fetch(
            'http://localhost/aeroground-api/maintenance/get.php'
          ),

          fetch(
            'http://localhost/aeroground-api/equipment/get.php'
          ),

          fetch(
            'http://localhost/aeroground-api/faults/get.php'
          )

        ]);


        const ordersResult =
          await ordersResponse.json();

        const equipmentResult =
          await equipmentResponse.json();

        const faultsResult =
          await faultsResponse.json();


        if (!ordersResult.success) {

          throw new Error(
            ordersResult.message ||
            'Unable to load maintenance.'
          );

        }


        if (!equipmentResult.success) {

          throw new Error(
            equipmentResult.message ||
            'Unable to load equipment.'
          );

        }


        if (!faultsResult.success) {

          throw new Error(
            faultsResult.message ||
            'Unable to load faults.'
          );

        }


        setOrders(
          ordersResult.data || []
        );

        setEquipmentList(
          equipmentResult.data || []
        );

        setFaults(
          faultsResult.data || []
        );


      } catch (error) {

        console.error(
          'Maintenance loading error:',
          error
        );


        setMessage(
          'Unable to load maintenance data: ' +
          error.message
        );


      } finally {

        setLoading(false);

      }

    };


    loadData();

  }, []);


  // ========================================================
  // SELECTED WORK ORDER
  // ========================================================

  const selected =
    orders.find(
      order =>
        order.id === selectedId
    );


  // ========================================================
  // FILTERED WORK ORDERS
  // ========================================================

  const visible =
    useMemo(
      () =>
        orders.filter(
          order =>
            filter === 'All' ||
            order.status === filter
        ),
      [orders, filter]
    );


  // ========================================================
  // METRICS
  // ========================================================

  const openOrders =
    orders.filter(
      order =>
        order.status !== 'Completed'
    ).length;


  const inProgress =
    orders.filter(
      order =>
        order.status ===
        'In Progress'
    ).length;


  const overdue =
    orders.filter(
      order =>
        order.status !==
          'Completed' &&
        order.scheduled &&
        order.scheduled < today
    ).length;


  const completed =
    orders.filter(
      order =>
        order.status ===
        'Completed'
    ).length;


  // ========================================================
  // CREATE WORK ORDER
  // ========================================================

  const submit = async event => {

    event.preventDefault();

    setMessage('');


    try {

      setSaving(true);


      const response = await fetch(
        'http://localhost/aeroground-api/maintenance/create.php',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(form)
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
          'Unable to create work order.'
        );

      }


      const newOrder = {

        ...form,

        dbId:
          result.dbId,

        id:
          result.workOrderCode,

        status:
          'Created',

        notes:
          ''

      };


      setOrders(current => [
        newOrder,
        ...current
      ]);


      setMessage(
        `${result.workOrderCode} created successfully.`
      );


      setForm(
        EMPTY_FORM
      );

      setOpen(false);


    } catch (error) {

      console.error(
        'Create work order error:',
        error
      );


      setMessage(
        'Unable to create work order: ' +
        error.message
      );


    } finally {

      setSaving(false);

    }

  };


  // ========================================================
  // UPDATE WORK ORDER
  // ========================================================

  const update = (
    id,
    changes
  ) => {

    setOrders(current =>
      current.map(
        order =>
          order.id === id
            ? {
                ...order,
                ...changes
              }
            : order
      )
    );

  };


  // ========================================================
  // SAVE MANAGED WORK ORDER
  // ========================================================

  const saveSelected =
    async () => {

      if (!selected) {
        return;
      }


      setMessage('');


      try {

        setSaving(true);


        const response = await fetch(
          'http://localhost/aeroground-api/maintenance/update.php',
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
                  selected.id,

                status:
                  selected.status,

                technician:
                  selected.technician,

                notes:
                  selected.notes || ''
              })
          }
        );


        const result =
          await response.json();


        if (!result.success) {

          throw new Error(
            result.message ||
            'Unable to update work order.'
          );

        }


        setMessage(
          `${selected.id} updated successfully.`
        );


        setSelectedId(null);


      } catch (error) {

        console.error(
          'Maintenance update error:',
          error
        );


        setMessage(
          'Unable to update work order: ' +
          error.message
        );


      } finally {

        setSaving(false);

      }

    };


  // ========================================================
  // OPEN CREATE MODAL
  // ========================================================

  const openCreate = () => {

    setForm(
      EMPTY_FORM
    );

    setMessage('');

    setOpen(true);

  };


  // ========================================================
  // PAGE
  // ========================================================

  return (

    <div className="ops-page">


      {/* HEADER */}

      <OpsHeader
        title="Hangar Maintenance & Work Orders"
        subtitle="Schedule preventive servicing and progress corrective repairs through inspection."
        action={

          <button
            className="btn-primary"
            onClick={openCreate}
          >

            <Plus size={15} />

            New Work Order

          </button>

        }
      />


      {/* MESSAGE */}

      {message && (

        <div
          className="ops-toast"
          role="alert"
        >
          {message}
        </div>

      )}


      {/* METRICS */}

      <div className="ops-metrics">

        <OpsMetric
          label="Open work orders"
          value={openOrders}
        />

        <OpsMetric
          label="In progress"
          value={inProgress}
        />

        <OpsMetric
          label="Overdue"
          value={overdue}
        />

        <OpsMetric
          label="Completed"
          value={completed}
        />

      </div>


      {/* REGISTER */}

      <section className="aeroground-card">

        <div
          className="ops-section-head ops-card"
        >

          <h2>
            Work order register
          </h2>


          <div className="ops-controls">

            <select
              className="form-select"
              aria-label="Filter work orders"
              value={filter}
              onChange={
                event =>
                  setFilter(
                    event.target.value
                  )
              }
            >

              {[
                'All',
                ...stages
              ].map(stage => (

                <option
                  key={stage}
                  value={stage}
                >
                  {stage}
                </option>

              ))}

            </select>


            <Wrench
              size={18}
              color="var(--primary)"
            />

          </div>

        </div>


        {loading ? (

          <p
            className="ops-muted"
            style={{
              padding: '20px'
            }}
          >
            Loading work orders from MySQL...
          </p>

        ) : (

          <div className="ops-table-wrap">

            <table className="ops-table">

              <thead>

                <tr>

                  <th>
                    Work order
                  </th>

                  <th>
                    Equipment
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Priority
                  </th>

                  <th>
                    Technician
                  </th>

                  <th>
                    Scheduled
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                  </th>

                </tr>

              </thead>


              <tbody>

                {visible.map(order => (

                  <tr key={order.id}>

                    <td>

                      <strong>
                        {order.id}
                      </strong>

                      <br />

                      <span className="ops-muted">

                        {
                          order.faultId ||
                          order.problem
                        }

                      </span>

                    </td>


                    <td>
                      {order.equipmentId}
                    </td>


                    <td>
                      {order.type}
                    </td>


                    <td>

                      <OpsBadge
                        text={
                          order.priority
                        }
                      />

                    </td>


                    <td>

                      {
                        order.technician ||
                        'Unassigned'
                      }

                    </td>


                    <td>
                      {order.scheduled}
                    </td>


                    <td>

                      <OpsBadge
                        text={
                          order.status
                        }
                      />

                    </td>


                    <td>

                      <button
                        className="ops-link"
                        onClick={() =>
                          setSelectedId(
                            order.id
                          )
                        }
                      >
                        Manage
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>


            {!visible.length && (

              <p className="ops-card ops-muted">
                No work orders match this filter.
              </p>

            )}

          </div>

        )}

      </section>


      <p className="ops-muted">

        Work orders are stored in MySQL.
        Completing a work order does not
        automatically release a fault safety
        lockout; safety release remains controlled
        from Fault Reports.

      </p>


      {/* ====================================================
          CREATE WORK ORDER MODAL
      ===================================================== */}

      <Modal
        isOpen={open}
        onClose={() =>
          setOpen(false)
        }
        title="Create work order"
        subtitle="Schedule a maintenance task"
        maxWidth="630px"
      >

        <form
          className="ops-form"
          onSubmit={submit}
        >


          {/* EQUIPMENT */}

          <label className="ops-field">

            Equipment

            <select
              className="form-input"
              required
              value={
                form.equipmentId
              }
              onChange={
                event =>
                  setForm({
                    ...form,

                    equipmentId:
                      event.target.value,

                    faultId:
                      ''
                  })
              }
            >

              <option value="">
                Select equipment
              </option>


              {equipmentList.map(
                equipment => (

                  <option
                    key={
                      equipment.id
                    }
                    value={
                      equipment.id
                    }
                  >

                    {equipment.id}

                    {' — '}

                    {equipment.category}

                  </option>

                )
              )}

            </select>

          </label>


          {/* LINKED FAULT */}

          <label className="ops-field">

            Linked fault

            <select
              className="form-input"
              value={
                form.faultId
              }
              disabled={
                !form.equipmentId
              }
              onChange={
                event => {

                  const fault =
                    faults.find(
                      item =>
                        item.id ===
                        event.target.value
                    );


                  setForm({
                    ...form,

                    faultId:
                      event.target.value,

                    problem:
                      fault
                        ?.description ||
                      form.problem,

                    priority:
                      fault
                        ?.severity ||
                      form.priority
                  });

                }
              }
            >

              <option value="">
                No linked fault
              </option>


              {faults
                .filter(
                  fault =>
                    fault.equipmentId ===
                      form.equipmentId &&

                    fault.status !==
                      'Resolved'
                )
                .map(
                  fault => (

                    <option
                      key={
                        fault.id
                      }
                      value={
                        fault.id
                      }
                    >

                      {fault.id}

                      {' · '}

                      {fault.category}

                    </option>

                  )
                )}

            </select>

          </label>


          {/* TYPE */}

          <label className="ops-field">

            Type

            <select
              className="form-input"
              value={
                form.type
              }
              onChange={
                event =>
                  setForm({
                    ...form,

                    type:
                      event.target.value
                  })
              }
            >

              <option>
                Corrective
              </option>

              <option>
                Preventive
              </option>

              <option>
                Inspection
              </option>

            </select>

          </label>


          {/* PRIORITY */}

          <label className="ops-field">

            Priority

            <select
              className="form-input"
              value={
                form.priority
              }
              onChange={
                event =>
                  setForm({
                    ...form,

                    priority:
                      event.target.value
                  })
              }
            >

              {[
                'Low',
                'Medium',
                'High',
                'Critical'
              ].map(priority => (

                <option
                  key={priority}
                  value={priority}
                >
                  {priority}
                </option>

              ))}

            </select>

          </label>


          {/* TECHNICIAN */}

          <label className="ops-field">

            Assigned technician

            <input
              className="form-input"
              maxLength={80}
              value={
                form.technician
              }
              onChange={
                event =>
                  setForm({
                    ...form,

                    technician:
                      event.target.value
                  })
              }
            />

          </label>


          {/* SCHEDULED */}

          <label className="ops-field">

            Scheduled date

            <input
              type="date"
              className="form-input"
              required
              value={
                form.scheduled
              }
              onChange={
                event =>
                  setForm({
                    ...form,

                    scheduled:
                      event.target.value
                  })
              }
            />

          </label>


          {/* PROBLEM */}

          <label className="ops-field full">

            Problem / planned service

            <textarea
              className="form-input"
              required
              minLength={8}
              maxLength={600}
              value={
                form.problem
              }
              onChange={
                event =>
                  setForm({
                    ...form,

                    problem:
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
                setOpen(false)
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
                  ? 'Creating...'
                  : 'Create work order'
              }

            </button>

          </div>

        </form>

      </Modal>


      {/* ====================================================
          MANAGE WORK ORDER MODAL
      ===================================================== */}

      <Modal
        isOpen={!!selected}
        onClose={() =>
          setSelectedId(null)
        }
        title={
          selected
            ? `${selected.id} · ${selected.equipmentId}`
            : ''
        }
        subtitle="Work order progress"
        maxWidth="600px"
      >

        {selected && (

          <div className="ops-form">


            <p className="ops-note ops-field full">

              {selected.problem}

            </p>


            {selected.faultId && (

              <p className="ops-muted ops-field full">

                Linked fault:{' '}

                <strong>
                  {selected.faultId}
                </strong>

              </p>

            )}


            {/* STATUS */}

            <label className="ops-field">

              Status

              <select
                className="form-input"
                value={
                  selected.status
                }
                onChange={
                  event =>
                    update(
                      selected.id,
                      {
                        status:
                          event.target.value
                      }
                    )
                }
              >

                {stages.map(
                  stage => (

                    <option
                      key={stage}
                      value={stage}
                    >
                      {stage}
                    </option>

                  )
                )}

              </select>

            </label>


            {/* TECHNICIAN */}

            <label className="ops-field">

              Technician

              <input
                className="form-input"
                value={
                  selected.technician ||
                  ''
                }
                maxLength={80}
                onChange={
                  event =>
                    update(
                      selected.id,
                      {
                        technician:
                          event.target.value
                      }
                    )
                }
              />

            </label>


            {/* NOTES */}

            <label className="ops-field full">

              Diagnosis / corrective action notes

              <textarea
                className="form-input"
                value={
                  selected.notes ||
                  ''
                }
                maxLength={1200}
                onChange={
                  event =>
                    update(
                      selected.id,
                      {
                        notes:
                          event.target.value
                      }
                    )
                }
              />

            </label>


            <div className="ops-form-actions">

              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setSelectedId(null)
                }
              >
                Cancel
              </button>


              <button
                type="button"
                className="btn-primary"
                disabled={saving}
                onClick={
                  saveSelected
                }
              >

                {
                  saving
                    ? 'Saving...'
                    : 'Save Changes'
                }

              </button>

            </div>

          </div>

        )}

      </Modal>

    </div>

  );

}