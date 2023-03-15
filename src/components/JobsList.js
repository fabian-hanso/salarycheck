import { useState, useEffect } from "react";
import reloadIcon from "../images/refresh.svg";
import "../App.css";
import nextButton from "../images/navigate_next_black_24dp.svg";

function JobsList({ jobs }) {
  const [average, setAverage] = useState(0);
  const [isActive, setIsActive] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (jobs) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [jobs]);

  function toggleDetailsMobile(index) {
    if (isActive === index) {
      setIsActive(-1);
    } else {
      setIsActive(index);
    }
    // setDetailsOpen(!detailsOpen);
  }

  return (
    <div className="mobile-entries">
      {isLoading ? (
        <div className="Loader-Wrapper">
          <img src={reloadIcon} alt="Reload Icon" className="Loading-Spinner" />
        </div>
      ) : (
        ""
      )}
      {jobs.map((jobs, index) => (
        <div
          className="mobile-entry"
          key={index}
          onClick={() => toggleDetailsMobile(index)}
        >
          <div className="main-mobile-content">
            <div className="mobile-headline">
              <h4 className="h4-dark">{jobs.jobtitle}</h4>
              <p>{jobs.joblocation}</p>
            </div>
            <div className="ButtonCover">
              <img
                className={
                  isActive === index ? "closeDetailsIcon" : "openDetailsIcon"
                }
                src={nextButton}
                alt="Toggle Details"
              />
            </div>
          </div>
          {isActive === index ? (
            <div className="details-mobile-content">
              <div className="content-block-mobile">
                <h4 className="h4-dark">
                  {jobs.jobremote ? "Erwünscht" : "Nicht erwünscht"}
                </h4>
                <p>Remotearbeit</p>
              </div>
              <div className="content-block-mobile">
                <h4 className="h4-dark">
                  {jobs.jobtimesflex ? "Flexibel" : "Fest"}
                </h4>
                <p>Arbeitszeiten</p>
              </div>
              <div className="content-block-mobile">
                <h4 className="h4-dark">{jobs.jobbasics}</h4>
                <p>Basics</p>
              </div>
              <div className="content-block-mobile">
                <h4 className="h4-dark">{jobs.jobframeworks}</h4>
                <p>Frameworks</p>
              </div>
              <div className="content-block-mobile">
                <h4 className="h4-dark">
                  {jobs.jobquereinsteiger ? "Erwünscht" : "Nicht erwünscht"}
                </h4>
                <p>Quereinsteiger</p>
              </div>
              <div className="content-block-mobile">
                <h4 className="h4-dark">
                  {jobs.jobvorwissen ? "Von Vorteil" : "Nicht nötig"}
                </h4>
                <p>Vorwissen</p>
              </div>
              <div className="content-block-mobile">
                <h4 className="h4-dark">{jobs.jobbenefits}</h4>
                <p>Benefits</p>
              </div>
              <div className="content-block-mobile">
                <a
                  target="_blank"
                  href={jobs.joblink}
                  className="jobs-link-headline"
                  rel="noreferrer"
                >
                  Hier mehr erfahren
                </a>
                <p>Link</p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
}

export default JobsList;
