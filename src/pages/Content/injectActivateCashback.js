import React from 'react';
import { render } from 'react-dom';
import ActivatePopup from './components/ActivatePopup';
import ActivatedPopup from './components/ActivatedPopup';

export const renderCashbackActivatedPopup = (data) => {
  if (!document.querySelector('#cb_activated_popup')) {
    let element = document.createElement('div');
    element.id = 'cb_activated_popup';
    document.body.append(element);
    render(<ActivatedPopup data={data} />, element);
  }
};

export const renderCashbackActivatePopup = (data) => {
  if (!document.querySelector('#cb_activate_popup')) {
    let element = document.createElement('div');
    element.id = 'cb_activate_popup';
    document.body.append(element);
    render(<ActivatePopup data={data} />, element);
  }
};
