import React from 'react';
import { VagouRegisterModal, VagouRegisterModalProps } from './VagouRegisterModal';

export type VagouMasterFormModalProps = VagouRegisterModalProps;
export const VagouMasterFormModal: React.FC<VagouMasterFormModalProps> = (props) => {
  return <VagouRegisterModal {...props} />;
};

export default VagouMasterFormModal;
