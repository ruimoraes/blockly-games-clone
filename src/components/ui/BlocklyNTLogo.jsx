import React from 'react';
import PropTypes from 'prop-types';

/**
 * BlocklyNTLogo - Componente SVG do logo da aplicação
 */
const BlocklyNTLogo = ({ 
  size = 24, 
  color = "#ED0973", 
  className = "",
  ...props 
}) => {  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 79 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block' }}
      {...props}
    >
      <path
        fill={color}
        d="M79 69.66S75.472 45.366 34.97 0c0 0-13.513 48.322-34.97 70 .053-.015.114-.023.167-.038.296-.076.6-.16.895-.244.524-.183 1.222-.419 2.056-.7 4.318-1.669 8.347-4.487 12.042-7.93 8.346-7.8 14.992-18.844 19.446-27.269 1.51-2.902 2.936-5.91 4.18-8.934l1.442 1.195c5.63 4.655 11.184 9.46 16.306 14.67 7.618 7.884 14.803 16.324 20.455 25.761.387.67 1.347 2.463 1.696 3.148z"
      />
    </svg>
  );
};

BlocklyNTLogo.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
  className: PropTypes.string
};

export default BlocklyNTLogo;
