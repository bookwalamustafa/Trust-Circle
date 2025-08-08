import React, { useState, useEffect } from 'react';
import GroupsHeader from '../components/GroupsHeader';
import Footer from '../components/Footer';
import GridBackground from '../components/GridBackground';
import LoanRequestTable from '../components/LoanRequestTable';
import LoanRequestModal from '../components/LoanRequestModal';
import PayModal from '../components/PayModal';
import '../css/App.css';
import '../css/GroupPage.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import ChatbotWidget from '../components/ChatbotWidget';
import TransactionHistory from '../components/TransactionHistory';
import { useNavigate } from 'react-router-dom';

// Test Users
const USER_GROUPS = {
  'mustafa.bookwala@sap.com': [
    {
      name: 'Japan Trip',
      poolSize: '$6,000',
      groupBalance: '$0',
      members: ['MB', 'LL', 'AC'],
      transactions: [],
      nextPaymentDue: 'August 8, 2025'
    }
  ],
  'lucas.loepke@sap.com': [
    {
      name: 'Japan Trip',
      poolSize: '$6,000',
      groupBalance: '$100',
      members: ['MB', 'LL', 'AC'],
      transactions: [
        { name: 'Mustafa', amount: '$100', date: 'August 8, 2025' }
      ],
      nextPaymentDue: 'August 8, 2025'
    },
    {
      name: 'Rent',
      poolSize: '$3,000',
      groupBalance: '$1,500',
      members: ['LL', 'NC', 'AC'],
      transactions: [
        { name: 'Lucas', amount: '$500', date: 'August 7, 2025' },
        { name: 'Nyle', amount: '$1000', date: 'August 6, 2025' }
      ],
      nextPaymentDue: 'August 20, 2025'
    }
  ],
  'adyan.chowdhury@sap.com': [
    {
      name: 'Japan Trip',
      poolSize: '$6,000',
      groupBalance: '$300',
      members: ['MB', 'LL', 'AC'],
      transactions: [
        { name: 'Lucas', amount: '$200', date: 'August 8, 2025' },
        { name: 'Mustafa', amount: '$100', date: 'August 8, 2025' }
      ],
      nextPaymentDue: 'August 8, 2025'
    },
    {
      name: 'Rent',
      poolSize: '$3,000',
      groupBalance: '$1,500',
      members: ['LL', 'NC', 'AC'],
      transactions: [
        { name: 'Lucas', amount: '$500', date: 'August 7, 2025' },
        { name: 'Nyle', amount: '$1000', date: 'August 6, 2025' }
      ],
      nextPaymentDue: 'August 20, 2025'
    },
    {
      name: 'Food Truck',
      poolSize: '$14,000',
      groupBalance: '$6,000',
      members: ['NC', 'AC'],
      transactions: [
        { name: 'Nyle', amount: '$500', date: 'July 1, 2025' },
        { name: 'Adyan', amount: '$300', date: 'July 5, 2025' }
      ],
      isLate: true,
      nextPaymentDue: 'August 1, 2025'
    }
  ]
};

const GroupPage = () => {
  const [hidden, setHidden] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [animationsLoaded, setAnimationsLoaded] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [showLatePopup, setShowLatePopup] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [allGroups, setAllGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    reason: '',
    amount: '',
    date: formatDate(new Date())
  });

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/');
    }
  }, [navigate]);

  const [loanRequests, setLoanRequests] = useState([
    {
      name: 'Evan',
      amount: '$500',
      reason: 'Happy Hour',
      date: 'August 8, 2025',
      status: '3/5',
      requiresAction: true
    }
  ]);

  // Get user's first name for display
  const getUserDisplayName = (email) => {
    const nameMap = {
      'mustafa.bookwala@sap.com': 'Mustafa',
      'adyan.chowdhury@sap.com': 'Adyan',
      'lucas.loepke@sap.com': 'Lucas',
      'nyle.coleman@sap.com': 'Nyle'
    };
    return nameMap[email] || 'User';
  };

  useEffect(() => {
    // Get user email from localStorage
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
    
    // Set groups based on user email
    if (email && USER_GROUPS[email]) {
      setAllGroups(USER_GROUPS[email]);
    } else {
      // Default groups for unknown users
      setAllGroups([
        {
          name: 'Default Group',
          poolSize: '$5,000',
          groupBalance: '$3,000',
          members: ['DG', 'MB', 'AD'],
          transactions: [
            { name: 'Default User', amount: '$200', date: 'May 1, 2025' },
          ],
          nextPaymentDue: 'June 15, 2025',
        }
      ]);
    }
    setIsLoading(false);
  }, []);

  const groupData = allGroups[currentGroupIndex] || {
    name: 'Loading...',
    poolSize: '$0',
    groupBalance: '$0',
    members: [],
    transactions: [],
    nextPaymentDue: 'Loading...'
  };

  useEffect(() => {
    setTimeout(() => {
      setAnimationsLoaded(true);
      setHasInitialized(true);
    }, 100);
  }, []);

  useEffect(() => {
    const isLate = allGroups[currentGroupIndex]?.isLate;
    setShowLatePopup(!!isLate);
  }, [currentGroupIndex]);

  const toggleBalances = () => setHidden(!hidden);

  const openModal = () => {
    setModalOpen(true);
    setFormData({ ...formData, date: formatDate(new Date()) });
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    const modalElement = document.getElementById('loan-modal');
    if (modalElement) {
      modalElement.classList.add('fade-out');
      setTimeout(() => {
        setModalOpen(false);
        document.body.classList.remove('modal-open');
        modalElement.classList.remove('fade-out');
      }, 300);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const submitRequest = () => {
    const { reason, amount } = formData;
    if (reason && amount) {
      const newRequest = {
        name: getUserDisplayName(userEmail),
        amount: `$${amount}`,
        reason,
        date: formData.date,
        status: `0/${groupData.members.length} Approved`,
        requiresAction: false
      };
      setLoanRequests([...loanRequests, newRequest]);
      closeModal();
      setFormData({ reason: '', amount: '', date: formatDate(new Date()) });
    }
  };

  function formatDate(dateObj) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  }

  const getMemberPosition = (index, totalMembers, radius = 180) => {
    const angle = (index * 360) / totalMembers;
    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    return { left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` };
  };

  const CustomMemberCircle = ({ groupData, hidden, slideIndex, isActive }) => (
    <div className={`circle-wrapper`}>
      <div className="dotted-circle"></div>
      <div className="members-container">
        {groupData.members.map((member, index) => {
          const position = getMemberPosition(index, groupData.members.length);
          return (
            <div
              key={`${slideIndex}-${index}`}
              className="member"
              style={{ ...position, animation: 'counterRotate 30s linear infinite' }}
            >
              {member}
            </div>
          );
        })}
      </div>
      <div className="center-info">
        <h2>{hidden ? '••••' : groupData.groupBalance}</h2>
        <p>out of</p>
        <div style={{ marginTop: '10px' }}>
          <h2 style={{ fontSize: '2rem', color: '#48cae4' }}>
            {hidden ? '••••' : groupData.poolSize}
          </h2>
        </div>
        {groupData.nextPaymentDue && (
          <div
            className="next-payment-info"
            style={{
              marginTop: '12px',
              fontSize: '0.9rem',
              color: groupData.isLate ? 'red' : '#444',
              fontWeight: groupData.isLate ? 'bold' : 'normal'
            }}
          >
            <strong>Next Due:</strong> {groupData.nextPaymentDue}
          </div>
        )}
      </div>
    </div>
  );

  const handlePayment = (amount) => {
    alert(`You paid $${amount.toFixed(2)} to ${groupData.name}`);
  
    const newTransaction = {
      name: getUserDisplayName(userEmail),
      amount: `$${amount.toFixed(0)}`,
      date: formatDate(new Date())
    };
  
    const updatedGroups = [...allGroups];
    const currentGroup = { ...updatedGroups[currentGroupIndex] };
  
    // Parse current balance and add new amount
    const currentBalance = parseFloat(currentGroup.groupBalance.replace(/\$|,/g, '')) || 0;
    const newBalance = currentBalance + amount;
  
    currentGroup.groupBalance = `$${newBalance.toLocaleString()}`;
    currentGroup.transactions = [newTransaction, ...currentGroup.transactions];
    updatedGroups[currentGroupIndex] = currentGroup;
  
    setAllGroups(updatedGroups);
  };
  

  const [firstName, lastName] = userEmail?.split('@')[0]?.split('.') ?? ['User', ''];

  return (
    <>
      <GridBackground />
      <GroupsHeader firstName={firstName} lastName={lastName} />

      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: '#0077b6'
        }}>
          Loading your groups...
        </div>
      ) : (
        <>
          {showLatePopup && (
        <div className="late-popup">
          <div className="late-popup-content">
            <button className="late-popup-close" onClick={() => setShowLatePopup(false)}>✖</button>
            <h2>⚠️ Late Payment Warning</h2>
            <p>
              Your payment for the <strong>{groupData.name}</strong> is overdue.
              Please make a payment immediately to avoid penalties.
            </p>
          </div>
        </div>
      )}

      <main className="main-content">
        <div className={`container ${hasInitialized ? 'animate-container' : ''}`}>
          {userEmail && (
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '20px', 
              color: '#48cae4',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              Welcome back, {getUserDisplayName(userEmail)}! 👋
            </div>
          )}
          <div className={`group-name ${hasInitialized ? 'animate-title' : ''}`}>
            <h2>{groupData.name}</h2>
            <button className="pay-button" onClick={() => setPayModalOpen(true)}>
              Make a Payment
            </button>
          </div>

          <Swiper
            modules={[Navigation, EffectCoverflow]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView={1.7}
            loop={false}
            spaceBetween={500}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 250,
              modifier: 1.5,
              slideShadows: false,
            }}
            navigation
            className="member-carousel"
            onSlideChange={(swiper) => setCurrentGroupIndex(swiper.activeIndex)}
            initialSlide={0}
          >
            {allGroups.map((group, index) => (
              <SwiperSlide key={index}>
                <CustomMemberCircle
                  groupData={group}
                  hidden={hidden}
                  slideIndex={index}
                  isActive={index === currentGroupIndex}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className='tables'>
            <div className='single-table'>
              <div className={`loan-header ${hasInitialized ? 'animate-loan-header' : ''}`} >
                <h2>Transaction History</h2>
              </div>
              <TransactionHistory groupData={groupData} animationsLoaded={hasInitialized} />
            </div>

            <div className='single-table'>
              <div className={`loan-header ${hasInitialized ? 'animate-loan-header' : ''}`}>
                <h2>Loan Requests</h2>
                <button className="request-loan-btn" onClick={openModal}>+</button>
              </div>
              <LoanRequestTable loanRequests={loanRequests} animationsLoaded={hasInitialized} />
            </div>
          </div>
        </div>
      </main>

      {modalOpen && (
        <LoanRequestModal
          formData={formData}
          handleInputChange={handleInputChange}
          submitRequest={submitRequest}
          closeModal={closeModal}
          handleBackdropClick={(e) => {
            if (e.target.id === 'loan-modal') {
              closeModal();
            }
          }}
        />
      )}

      {payModalOpen && (
        <PayModal
          groupName={groupData.name}
          closeModal={() => setPayModalOpen(false)}
          handlePayment={handlePayment}
        />
      )}

      <ChatbotWidget />
      <Footer />
        </>
      )}
    </>
  );
};

export default GroupPage;
