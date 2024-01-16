import React from 'react'
import './UserMain.css';

export default function UserMain(user) {
  return (
    <div
      key={user.id}
      className={`user-container ${user.highlighted && "highlighted-item"}`}
      onMouseDown={user.onMouseDown}
    >
      <img
        src={user.profilePhoto}
        alt={`${user.name}`}
        className="profile-image"
      />
      <div className="user-name">{`${user.name}`}</div>
      <div className="user-email">{user.email}</div>
    </div>
  );
}
