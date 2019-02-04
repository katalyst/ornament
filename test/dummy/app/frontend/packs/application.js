import ReactOnRails from 'react-on-rails';
import Modal from '../javascripts/react/Modal/Modal.jsx';
import AjaxModal from '../javascripts/react/Modal/AjaxModal.jsx';

// Generate application.css
import '../stylesheets/application.scss';

// Import the application file as the contents of this file
import '../javascripts/application.js';

ReactOnRails.register({ 
  Modal,
  AjaxModal,
});