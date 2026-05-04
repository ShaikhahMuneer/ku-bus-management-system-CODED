import React from "react";
import { MapPin, Phone, Clock3, CheckCircle } from "lucide-react";
import { beeyoutPickupBlocks } from "../../../data/sharedData";

function PickupListSection({ pickupStatus, updatePickupStatus }) {
  const handleArrived = (studentId) => updatePickupStatus(studentId, { arrived: true });
  const handlePickup = (studentId) => updatePickupStatus(studentId, { arrived: true, pickedUp: true });
  return (
    <section className="section-card pickup-page">
      <div className="section-header"><div><h2>Beeyout Pickup List</h2><p>Manage home-service pickups by block</p></div></div>
      {beeyoutPickupBlocks.map((group) => {
        const pickedCount = group.students.filter((student) => pickupStatus[student.id]?.pickedUp).length;
        const percent = Math.round((pickedCount / group.students.length) * 100);
        return <div key={group.block} className="pickup-card-new">
          <div className="pickup-card-header"><div className="pickup-block-title"><div className="pickup-location-icon"><MapPin size={22} /></div><div><h3>{group.block}</h3><p>{group.students.length} passengers</p></div></div><div className="picked-count"><span>Picked Up</span><strong>{pickedCount}/{group.students.length}</strong></div></div>
          {group.students.map((student, index) => {
            const status = pickupStatus[student.id] || {}; const isArrived = status.arrived; const isPickedUp = status.pickedUp;
            return <div key={student.id} className={`pickup-student-row ${isPickedUp ? "student-completed" : ""}`}><div className="pickup-student-left"><div className={`student-number ${isPickedUp ? "student-number-done" : ""}`}>{index + 1}</div><div><div className="student-name-row"><strong className={isPickedUp ? "student-done-name" : ""}>{student.name}</strong>{isPickedUp && <CheckCircle size={15} />}</div><div className="student-details"><span><MapPin size={13} />{student.location}</span><span><Phone size={13} />{student.phone}</span>{isArrived && <span className="arrived-time"><Clock3 size={13} />Arrived: {status.arrivedTime}</span>}{isPickedUp && <span className="picked-time"><Clock3 size={13} />Picked: {status.pickedTime}</span>}</div></div></div><div className="pickup-actions">{!isArrived && !isPickedUp && <button className="arrived-btn" onClick={() => handleArrived(student.id)}>Mark Arrived</button>}{isArrived && !isPickedUp && <><button className="arrived-btn">Arrived ✓</button><button className="pickup-btn" onClick={() => handlePickup(student.id)}>Mark Pickup</button></>}{isPickedUp && <button className="completed-btn">Completed ✓</button>}</div></div>;
          })}
          <div className="pickup-progress-area"><div className="pickup-progress-text"><span>Progress</span><strong>{percent}% Complete</strong></div><div className="pickup-progress-line"><div style={{ width: `${percent}%` }}></div></div></div>
        </div>;
      })}
    </section>
  );
}
export default PickupListSection;
