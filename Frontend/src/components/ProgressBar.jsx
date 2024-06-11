import PropTypes from "prop-types";
import "../styles/ProgressBar.css";

const ProgressBar = ({ percentage }) => {
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${percentage}%` }}>
        {percentage} %
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default ProgressBar;
