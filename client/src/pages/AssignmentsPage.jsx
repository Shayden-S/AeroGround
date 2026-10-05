import React, { useEffect, useMemo, useState } from 'react';
import { PlaneTakeoff } from 'lucide-react';

import { flights } from '../data/operationsData';

import {
  OpsHeader,
  OpsMetric,
  OpsBadge
} from '../components/common/OperationsUI';

import './OperationsPages.css';


// ==========================================================
// CATEGORY MAPPING
// Stage 1 flight requirements -> MySQL equipment categories
// ==========================================================

const CATEGORY_MAP = {

  'Pushback Tug': [
    'Pushback Tug',
    'Aircraft Pushback Tug'
  ],

  'Ground Power': [
    'Ground Power',
    'Ground Power Unit'
  ],

  'Belt Loader': [
    'Belt Loader',
    'Baggage Equipment'
  ],

  'Baggage Tractor': [
    'Baggage Tractor',
    'Baggage Equipment'
  ],

  'Passenger Bus': [
    'Passenger Bus',
    'Passenger Equipment'
  ],

  'Passenger Stairs': [
    'Passenger Stairs',
    'Passenger Equipment'
  ],

  'Catering Truck': [
    'Catering Truck',
    'Catering Equipment'
  ],

  'Fuel Truck': [
    'Fuel Truck',
    'Fuel Equipment'
  ]

};


// ==========================================================
// HELPER FUNCTIONS
// ==========================================================

function isAvailable(equipment) {

  return (
    String(equipment?.status || '')
      .trim()
      .toLowerCase() === 'available'
  );

}


function matchesCategory(equipment, requiredType) {

  const accepted =
    CATEGORY_MAP[requiredType] || [requiredType];

  const category =
    String(equipment?.category || '')
      .trim()
      .toLowerCase();

  return accepted.some(
    item =>
      item.toLowerCase() === category
  );

}


// ==========================================================
// PAGE
// ==========================================================

export default function AssignmentsPage() {

  const [assignments, setAssignments] =
    useState([]);

  const [equipmentList, setEquipmentList] =
    useState([]);

  const [message, setMessage] =
    useState('');

  const [loading, setLoading] =
    useState(true);


  // ========================================================
  // LOAD DATA FROM MYSQL
  // ========================================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);
        setMessage('');

        const [
          assignmentsResponse,
          equipmentResponse
        ] = await Promise.all([

          fetch(
            'http://localhost/aeroground-api/assignments/get.php'
          ),

          fetch(
            'http://localhost/aeroground-api/equipment/get.php'
          )

        ]);


        const assignmentsResult =
          await assignmentsResponse.json();

        const equipmentResult =
          await equipmentResponse.json();


        if (!assignmentsResult.success) {

          throw new Error(
            assignmentsResult.message ||
            'Unable to load assignments.'
          );

        }


        if (!equipmentResult.success) {

          throw new Error(
            equipmentResult.message ||
            'Unable to load equipment.'
          );

        }


        setAssignments(
          assignmentsResult.data || []
        );


        setEquipmentList(
          equipmentResult.data || []
        );


      } catch (error) {

        console.error(
          'Assignment loading error:',
          error
        );

        setMessage(
          'Unable to load assignment data: ' +
          error.message
        );


      } finally {

        setLoading(false);

      }

    };


    loadData();

  }, []);


  // ========================================================
  // CREATE ALL REQUIRED FLIGHT SLOTS
  // ========================================================

  const slots = useMemo(() => {

    return flights.flatMap(
      flight =>
        flight.required.map(
          type => ({
            flightId: flight.id,
            type
          })
        )
    );

  }, []);


  // ========================================================
  // EQUIPMENT CURRENTLY IN USE
  // ========================================================

  const assignedIds = useMemo(() => {

    return new Set(
      assignments
        .map(
          assignment =>
            assignment.equipmentId
        )
        .filter(Boolean)
    );

  }, [assignments]);


  // ========================================================
  // ASSIGN / UNASSIGN
  // ========================================================

  const assign = async (
    flightId,
    type,
    equipmentId
  ) => {

    setMessage('');


    // ======================================================
    // UNASSIGN
    // ======================================================

    if (!equipmentId) {

      try {

        const response = await fetch(
          'http://localhost/aeroground-api/assignments/delete.php',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              flightId,
              type
            })
          }
        );


        const result =
          await response.json();


        if (!result.success) {

          throw new Error(
            result.message ||
            'Unable to remove assignment.'
          );

        }


        setAssignments(current =>
          current.filter(
            assignment =>
              !(
                assignment.flightId ===
                  flightId &&
                assignment.type ===
                  type
              )
          )
        );


        setMessage(
          `${flightId} ${type} assignment removed.`
        );


      } catch (error) {

        console.error(
          'Unassign error:',
          error
        );

        setMessage(
          'Unable to remove assignment: ' +
          error.message
        );

      }

      return;
    }


    // ======================================================
    // FIND EQUIPMENT
    // ======================================================

    const equipment =
      equipmentList.find(
        item =>
          item.id === equipmentId
      );


    if (!equipment) {

      setMessage(
        `${equipmentId} does not exist in the fleet.`
      );

      return;
    }


    // ======================================================
    // CHECK AVAILABILITY
    // ======================================================

    if (!isAvailable(equipment)) {

      setMessage(
        `${equipmentId} cannot be assigned because its current status is ${equipment.status}.`
      );

      return;
    }


    // ======================================================
    // CHECK CATEGORY
    // ======================================================

    if (
      !matchesCategory(
        equipment,
        type
      )
    ) {

      setMessage(
        `${equipmentId} is not suitable for ${type}.`
      );

      return;
    }


    // ======================================================
    // PREVENT DOUBLE ASSIGNMENT
    // ======================================================

    const usedElsewhere =
      assignments.some(
        assignment =>
          assignment.equipmentId ===
            equipmentId &&

          !(
            assignment.flightId ===
              flightId &&
            assignment.type ===
              type
          )
      );


    if (usedElsewhere) {

      setMessage(
        `${equipmentId} is already assigned to another flight.`
      );

      return;
    }


    // ======================================================
    // SAVE ASSIGNMENT TO MYSQL
    // ======================================================

    try {

      const response = await fetch(
        'http://localhost/aeroground-api/assignments/save.php',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            flightId,
            type,
            equipmentId
          })
        }
      );


      const result =
        await response.json();


      if (!result.success) {

        throw new Error(
          result.message ||
          'Unable to save assignment.'
        );

      }


      const newAssignment = {

        dbId:
          result.dbId || null,

        flightId,

        type,

        equipmentId,

        status: 'Assigned'

      };


      setAssignments(current => {

        const remaining =
          current.filter(
            assignment =>
              !(
                assignment.flightId ===
                  flightId &&
                assignment.type ===
                  type
              )
          );


        return [
          ...remaining,
          newAssignment
        ];

      });


      setMessage(
        `${equipmentId} successfully assigned to ${flightId} for ${type}.`
      );


    } catch (error) {

      console.error(
        'Assignment save error:',
        error
      );

      setMessage(
        'Unable to save assignment: ' +
        error.message
      );

    }

  };


  // ========================================================
  // METRICS
  // ========================================================

  const assignedPositionCount =
    slots.filter(slot =>
      assignments.some(
        assignment =>
          assignment.flightId ===
            slot.flightId &&
          assignment.type ===
            slot.type &&
          assignment.equipmentId
      )
    ).length;


  const awaitingCount =
    slots.length -
    assignedPositionCount;


  // ========================================================
  // PAGE
  // ========================================================

  return (

    <div className="ops-page">

      <OpsHeader
        title="Ramp GSE Flight Allocations"
        subtitle="Assign serviceable ground equipment to active turnarounds. One unit can serve one flight at a time."
        action={
          <PlaneTakeoff
            size={24}
            color="var(--primary)"
          />
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
          label="Turnarounds"
          value={flights.length}
        />

        <OpsMetric
          label="Required positions"
          value={slots.length}
        />

        <OpsMetric
          label="Assigned positions"
          value={assignedPositionCount}
        />

        <OpsMetric
          label="Awaiting dispatch"
          value={awaitingCount}
        />

      </div>


      {/* LOADING */}

      {loading ? (

        <div className="aeroground-card">

          <p className="ops-muted">
            Loading fleet and assignments
            from MySQL...
          </p>

        </div>

      ) : (

        // ==================================================
        // FLIGHT CARDS
        // ==================================================

        <div className="ops-grid">

          {flights.map(flight => (

            <section
              className="aeroground-card ops-flight"
              key={flight.id}
            >

              {/* FLIGHT HEADER */}

              <div className="ops-flight-head">

                <div>

                  <h2>
                    {flight.id}
                    {' · Gate '}
                    {flight.gate}
                  </h2>

                  <p>
                    {flight.aircraft}
                  </p>

                </div>


                <div>

                  <small>
                    Arrival {flight.arrival}
                  </small>

                  <br />

                  <small>
                    Departure {flight.departure}
                  </small>

                </div>

              </div>


              {/* ============================================
                  REQUIRED EQUIPMENT SLOTS
              ============================================= */}

              {flight.required.map(
                (type, index) => {

                  // ----------------------------------------
                  // CURRENT ASSIGNMENT
                  // ----------------------------------------

                  const currentAssignment =
                    assignments.find(
                      assignment =>
                        assignment.flightId ===
                          flight.id &&
                        assignment.type ===
                          type
                    );


                  const current =
                    currentAssignment
                      ?.equipmentId || '';


                  // ----------------------------------------
                  // ELIGIBLE EQUIPMENT
                  // ----------------------------------------

                  const eligible =
                    equipmentList.filter(
                      equipment => {

                        const correctCategory =
                          matchesCategory(
                            equipment,
                            type
                          );


                        const available =
                          isAvailable(
                            equipment
                          );


                        const notUsedElsewhere =
                          !assignedIds.has(
                            equipment.id
                          ) ||
                          equipment.id ===
                            current;


                        return (
                          correctCategory &&
                          available &&
                          notUsedElsewhere
                        );

                      }
                    );


                  // ----------------------------------------
                  // SLOT STATUS
                  // ----------------------------------------

                  let badgeText =
                    'Unavailable';

                  let badgeTone =
                    'red';


                  if (current) {

                    badgeText =
                      'Assigned';

                    badgeTone =
                      'blue';

                  } else if (
                    eligible.length > 0
                  ) {

                    badgeText =
                      'Awaiting Assignment';

                    badgeTone =
                      'amber';

                  }


                  // ----------------------------------------
                  // RENDER SLOT
                  // ----------------------------------------

                  return (

                    <div
                      className="ops-slot"
                      key={
                        `${flight.id}-${type}-${index}`
                      }
                    >

                      <div>

                        <strong>
                          {type}
                        </strong>

                        <br />

                        <OpsBadge
                          text={badgeText}
                          tone={badgeTone}
                        />

                      </div>


                      <select
                        className="form-select"
                        aria-label={
                          `${flight.id} ${type}`
                        }
                        value={current}
                        onChange={
                          event =>
                            assign(
                              flight.id,
                              type,
                              event.target.value
                            )
                        }
                      >

                        <option value="">
                          Unassigned
                        </option>


                        {eligible.map(
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

                              {' · '}

                              {
                                equipment.location ||
                                'No location'
                              }

                            </option>

                          )
                        )}

                      </select>

                    </div>

                  );

                }
              )}

            </section>

          ))}

        </div>

      )}


      <p className="ops-muted">

        Assignment choices are stored in the
        AeroGround MySQL database. Only available
        and compatible fleet equipment can be
        dispatched.

      </p>

    </div>

  );

}