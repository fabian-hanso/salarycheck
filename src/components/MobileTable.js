import { useState, useEffect } from "react";
import reloadIcon from "../images/refresh.svg";
import "../App.css";
import nextButton from "../images/navigate_next_black_24dp.svg";

function MobileTable({ allEntries, mainAverage }) {
  const [entries, setEntries] = useState([]);
  const [average, setAverage] = useState(0);
  const [isActive, setIsActive] = useState(-1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setEntries(allEntries);
    if (allEntries.length > 0) {
      setIsLoaded(true);
    }
  }, [allEntries]);

  useEffect(() => {
    setAverage(mainAverage);
  }, [mainAverage]);

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
      {!isLoaded ? (
        <div className="Loader-Wrapper">
          <img src={reloadIcon} alt="Reload Icon" className="Loading-Spinner" />
        </div>
      ) : (
        ""
      )}
      {entries.map((entry, index) => (
        <div
          className="mobile-entry"
          key={index}
          onClick={() => toggleDetailsMobile(index)}
        >
          <div className="main-mobile-content">
            <div className="mobile-headline">
              <h4 className="h4-dark">{entry.thejob}</h4>
              <p>{entry.thefee.toLocaleString() + " €"}</p>
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
                  {entry.theexperience === 0
                    ? "< 1 Jahr"
                    : entry.theexperience === 1
                    ? "1 Jahr"
                    : entry.theexperience + " Jahre"}
                </h4>
                <p>Berufserfahrung</p>
              </div>
              <div className="content-block-mobile">
                <h4 className="h4-dark">{entry.theage}</h4>
                <p>Alter</p>
              </div>
              <div className="content-block-mobile">
                <h4 className="h4-dark">{entry.loc}</h4>
                <p>Standort</p>
              </div>
              <div className="content-block-mobile">
                <h4 className="h4-dark">
                  {entry.loc === 0
                    ? "Ja"
                    : entry.thenewbie === 1
                    ? "Nein"
                    : "Ja"}
                </h4>
                <p>Quereinsteiger</p>
              </div>
              <div className="content-block-mobile">
                <h4 className="h4-dark">
                  {Math.floor(entry.thefee / 12).toLocaleString() + " €"}
                </h4>
                <p>Brutto / Monat</p>
              </div>
              <div className="content-block-mobile">
                <h4 className="h4-dark">
                  {(entry.thefee - average).toLocaleString() >= 0
                    ? "+" + (entry.thefee - average).toLocaleString() + " €"
                    : (entry.thefee - average).toLocaleString() + " €"}
                </h4>
                <p>/ Durchschnittsgehalt</p>
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

export default MobileTable;
