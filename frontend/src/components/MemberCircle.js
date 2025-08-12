import React from 'react';

const MemberCircle = ({ members = [] }) => {
  const radius = 120;
  const centerX = 150;
  const centerY = 150;

  return (
    <div className="member-circle-wrapper">
      <div className="member-circle">
        {members.map((member, index) => {
          const angle = (index / members.length) * 2 * Math.PI;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <div
              key={index}
              className="member-node"
              style={{
                left: `${50 + x / 3}px`,
                top: `${50 + y / 3}px`,
              }}
            >
              {member.name || `Member ${index + 1}`}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberCircle;
