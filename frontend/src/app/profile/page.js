'use client';

import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import ProfileCard from '../../components/ProfileCard';
import ProfileForm from '../../components/ProfileForm';
import PasswordForm from '../../components/PasswordForm';
import InterfaceSettings from '../../components/InterfaceSettings';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('personal');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    gender: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        middleName: user.middleName || '',
        email: user.email || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Сохранение:', formData);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <ProfileForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />;
      case 'password':
        return <PasswordForm />;
      // case 'interface':
      //   return <InterfaceSettings />;
      default:
        return <ProfileForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />;
    }
  };

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6 h-full">
      <ProfileCard 
        activeTab={activeTab}
        setActiveTab={setActiveTab} 
        user={user}
      />
      {renderContent()}
    </div>
  );
}