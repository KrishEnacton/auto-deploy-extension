import React, { useContext, useEffect, useState } from 'react';
import { translate } from '../../../../common/utils_global';
import { UserContext } from '../../context/UserContext';

const ReferNEarn = () => {
  const [urls, setUrls] = useState();
  const [bonusTypes, setBonusTypes] = useState();
  const [currencyInfo, setCurrencyInfo] = useState();
  const [referralPer, setReferralPer] = useState(0);

  const userData = useContext(UserContext)[0];
  const isUserLogin = useContext(UserContext)[3];

  useEffect(() => {
    if (isUserLogin && userData.member_info) {
      setUrls(userData.urls);
      setBonusTypes(userData.bonus_types);
      setCurrencyInfo(userData.currency_info);
      if (userData.member_info.referral_percent) {
        setReferralPer(userData.member_info.referral_percent + '%');
      } else if (userData.urls.referral_percent) {
        setReferralPer(userData.urls.referral_percent + '%');
      } else {
        setReferralPer('');
      }
    }
  }, [userData, isUserLogin]);

  return (
    <div>
      Refer & earn
      {isUserLogin ? (
        <>
          {referralPer}
          {currencyInfo?.currency_prefix}
          {bonusTypes?.refer_bonus?.amount}
          {currencyInfo?.currency_suffix}
          {bonusTypes?.join_with_refer ? (
            <>
              {currencyInfo?.currency_prefix}
              {bonusTypes?.join_with_refer?.amount}
              {currencyInfo?.currency_suffix}
              {translate('joining_bonus')}
            </>
          ) : null}
          {urls?.referral_url}
          fb:{urls?.facebook_share_url} {/* anchor tag */}
          twitter:{urls?.twitter_share_url} {/* anchor tag */}
          whatsapp:{urls?.whats_app_url} {/* anchor tag */}
          HIW:{' '}
          <a href={urls?.how_it_works} target="_blank" rel="noopener noreferrer">
            {translate('how_it_works')}
          </a>
          RnE:{' '}
          <a href={urls?.refer_n_earn_activity} target="_blank" rel="noopener noreferrer">
            {' '}
            {translate('your_referral_activities')}
          </a>
        </>
      ) : (
        <>blur hover</>
      )}
    </div>
  );
};

export default ReferNEarn;
