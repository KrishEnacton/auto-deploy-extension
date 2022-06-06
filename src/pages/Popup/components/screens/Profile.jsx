import React, { useContext } from 'react';
import { translate } from '../../../../common/utils_global';
import { UserContext } from '../../context/UserContext';

const Profile = () => {
  const userData = useContext(UserContext)[0];
  const isUserLogin = useContext(UserContext)[3];
  return (
    <div>
      {isUserLogin && userData.member_info ? (
        <>
          {userData.user_initials}
          {userData.member_info.first_name} {userData.member_info.last_name}
          {userData.member_info.member_since}
          <hr />
          Cashback
          <hr />
          {userData.currency_info.currency_prefix}
          {userData.earning.cashback.total}
          {userData.currency_info.currency_suffix}
          <hr />
          {userData.currency_info.currency_prefix}
          {userData.earning.confirmed_cashback_amount}
          {userData.currency_info.currency_suffix}
          <hr />
          {userData.currency_info.currency_prefix}
          {userData.earning.cashback.pending}
          {userData.currency_info.currency_suffix}
          <hr />
          {userData.currency_info.currency_prefix}
          {userData.earning.paid.cashback}
          {userData.currency_info.currency_suffix}
          <hr />
          Rewards
          <hr />
          {userData.currency_info.currency_prefix}
          {userData.earning.reward.total}
          {userData.currency_info.currency_suffix}
          <hr />
          {userData.currency_info.currency_prefix}
          {userData.earning.confirmed_reward_amount}
          {userData.currency_info.currency_suffix}
          <hr />
          {userData.currency_info.currency_prefix}
          {userData.earning.reward.pending}
          {userData.currency_info.currency_suffix}
          <hr />
          {userData.currency_info.currency_prefix}
          {userData.earning.paid.reward}
          {userData.currency_info.currency_suffix}
          <hr />
          <a href={userData.urls.cashback_payment} target="_blank" rel="noopener noreferrer">
            {translate('cashback_payment')}
          </a>
          <a href={userData.urls.cashback_activity} target="_blank" rel="noopener noreferrer">
            {translate('cashback_activity')}
          </a>
          <a href={userData.urls.missing_payment} target="_blank" rel="noopener noreferrer">
            {translate('missing_payment')}
          </a>
        </>
      ) : (
        'hover'
      )}
    </div>
  );
};

export default Profile;
