import PropTypes from "prop-types";
import "../styles/ProgressBar.css";

const ProgressBar = ({ percentage, temp }) => {
  const classToAdd = () => {
    if (percentage < 50) {
      return "safe";
    } else if (percentage < 80) {
      return "warning";
    } else {
      return "critical";
    }
  };

  return (
    <div className="progress-bar">
      <div
        className={`progress ${classToAdd()}`}
        style={{ width: `${percentage}%` }}
      >
        {percentage} % {temp && <span className="temp">& {temp} °C</span>}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
};

export default ProgressBar;
