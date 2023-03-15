import "./App.css";
import TextField from "@mui/material/TextField";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import centerIcon from "./images/center.svg";
import topIcon from "./images/top.svg";
import bottomIcon from "./images/bottom.svg";
import DoneIcon from "./images/done_all_white_24dp.svg";
import Button from "@mui/material/Button";
import firebase from "./firebase";
import { useState, useEffect } from "react";
import { ages } from "./helper/ages";
import { levelList } from "./helper/level";
import { bereichList } from "./helper/bereich";
import { currencies } from "./helper/currencies";
import { experience } from "./helper/experience";
import { quereinsteigerList } from "./helper/newbie";
import MobileTable from "./components/MobileTable";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import Footer from "./components/Footer";
import { MessengerChat } from "react-messenger-chat-plugin";
import JobsList from "./components/JobsList";

function App() {
  const [currency, setCurrency] = useState(42000);
  const [age, setAge] = useState(22);
  const [entries, setEntries] = useState([]);
  const [average, setAverage] = useState(0);
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(0);
  const [Experience, setExperience] = useState(0);
  const [quereinsteiger, setQuereinsteiger] = useState(0);
  const [formSuccess, setFormSuccess] = useState(false);
  const [handleLevel, setHandleLevel] = useState("Junior");
  const [handleBereich, setHandleBereich] = useState("Frontend");
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [filteredEntries, setFilteredEntries] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [frontendCount, setFrontendCount] = useState(0);
  const [backEndCount, setBackendCount] = useState(0);
  const [fullStackCount, setFullStackCount] = useState(0);

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleAge = (event) => {
    setAge(event.target.value);
  };

  const handleExperience = (event) => {
    setExperience(event.target.value);
  };

  const handleQuereinsteiger = (event) => {
    setQuereinsteiger(event.target.value);
  };

  const handleLevelList = (event) => {
    setHandleLevel(event.target.value);
  };

  const handleBereichListe = (event) => {
    setHandleBereich(event.target.value);
  };

  const displaySuccess = () => {
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
    }, 8000);
  };

  function formSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const timestamp = serverTimestamp();
    const {
      location,
      fee,
      job,
      age,
      jobexperience,
      quereinsteiger,
      joblevel,
      bereich,
    } = form.elements;
    const loc = location.value;
    const thefee = parseInt(fee.value);
    const thejoblevel = joblevel.value;
    const thebereich = bereich.value;
    const thejob = job.value;
    const theexperience = parseInt(jobexperience.value);
    const theage = parseInt(age.value);
    const thenewbie = parseInt(quereinsteiger.value);
    const payload = {
      loc,
      thefee,
      thejoblevel,
      thebereich,
      thejob,
      theage,
      timestamp,
      theexperience,
      thenewbie,
    };
    const collectionRef = collection(firebase, "all");
    addDoc(collectionRef, payload);
    displaySuccess();
    form.reset();
  }

  // Get all Entrys
  useEffect(() => {
    const isunsubscribe = onSnapshot(
      query(collection(firebase, "all"), orderBy("timestamp", "asc")),
      (snapshot) => {
        setEntries(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    );

    return isunsubscribe;
  }, []);

  // Get Jobs
  useEffect(() => {
    const isunsubscribe = onSnapshot(
      query(collection(firebase, "jobs")),
      (snapshot) => {
        setJobs(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    );

    return isunsubscribe;
  }, []);

  useEffect(() => {
    let countedSalary = 0;

    entries.forEach((element) => {
      countedSalary += element.thefee;
    });

    let nextShit = countedSalary / entries.length;

    if (nextShit >= 0 && nextShit <= 1000000) {
      setAverage(Math.floor(Math.round(nextShit)));
    } else {
      setAverage(0);
    }
  }, [entries]);

  useEffect(() => {
    let salaries = entries.map((item) => item.thefee);
    setMinSalary(Math.min(...salaries));
    setMaxSalary(Math.max(...salaries));
  }, [entries]);

  const onSetActiveFilter = (tab) => {
    setActiveFilter(tab);
    if (tab !== "Alle") {
      setFilteredEntries(
        entries.filter((entry) => entry.thebereich.includes(tab))
      );
    }
  };

  useEffect(() => {
    setFrontendCount(
      entries.filter((entry) => entry.thebereich.includes("Frontend"))
    );
    setBackendCount(
      entries.filter((entry) => entry.thebereich.includes("Backend"))
    );
    setFullStackCount(
      entries.filter((entry) => entry.thebereich.includes("Full-Stack"))
    );
  }, [entries]);

  return (
    <div className="App">
      <div
        className={
          !formSuccess ? "success-snack" : " success-snack success-snack-active"
        }
        onClick={() => setFormSuccess(false)}
      >
        <div className="snack-center">
          <img className="snack-image" src={DoneIcon} alt="Done" />
        </div>
        <div className="snack-center">
          <p className="snack-text">Daten eingereicht!</p>
        </div>
      </div>
      <div className="content-wrapper">
        <h1>
          <span>Vergleich der </span>Einstiegsgehälter
        </h1>
        <form onSubmit={formSubmit} className="Input-Wrapper">
          <TextField
            fullWidth
            required
            name="job"
            id="outlined-basic"
            label="Stellenbezeichnung"
            variant="outlined"
            className="Input"
          />
          <TextField
            required
            fullWidth
            id="outlined-basic"
            label="Standort"
            name="location"
            variant="outlined"
            className="Input"
          />
          <TextField
            id="outlined-select-currency"
            select
            fullWidth
            label="Level"
            name="joblevel"
            value={handleLevel}
            onChange={handleLevelList}
            placeholder="Junior"
            className="Input"
            required
          >
            {levelList.map((level) => (
              <MenuItem key={level.value} value={level.value}>
                {level.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-select-currency"
            select
            fullWidth
            label="Bereich"
            name="bereich"
            value={handleBereich}
            onChange={handleBereichListe}
            placeholder="Frontend"
            className="Input"
            required
          >
            {bereichList.map((bereich) => (
              <MenuItem key={bereich.value} value={bereich.value}>
                {bereich.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-select-currency"
            select
            fullWidth
            required
            label="Gehalt"
            name="fee"
            value={currency}
            onChange={handleChange}
            placeholder="42.000 €"
            className="Input"
          >
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-select-currency"
            select
            fullWidth
            label="Berufserfahrung"
            name="jobexperience"
            value={Experience}
            onChange={handleExperience}
            placeholder="0"
            className="Input"
            required
          >
            {experience.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-select-currency"
            select
            fullWidth
            label="Alter"
            name="age"
            value={age}
            onChange={handleAge}
            placeholder="25"
            className="Input"
            required
          >
            {ages.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="outlined-select-currency"
            select
            fullWidth
            label="Quereinsteiger"
            name="quereinsteiger"
            value={quereinsteiger}
            onChange={handleQuereinsteiger}
            placeholder="0"
            className="Input"
            required
          >
            {quereinsteigerList.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Button type="submit" variant="contained" className="button-color">
            Einreichen
          </Button>
        </form>
        <div>
          <p className="small-p">
            * Mit Sternen markierte Felder sind Pflichtfelder. Bitte gib uns
            deine anonymen Daten, damit andere einen Vergleich ziehen können.
          </p>
          <div className="Trennlinie"></div>
        </div>
        <h1>
          <span>Auf einen </span>Blick
        </h1>
        <div className="overViewWrapper">
          <div className="overViewInner">
            <img src={bottomIcon} alt="" className="grid-ju-ce" />
            <h2 className="grid-ju-ce">
              {minSalary.toLocaleString() >= 0
                ? minSalary.toLocaleString() + " €"
                : "0 €"}
            </h2>
            <p className="grid-ju-ce">Niedrigste Angabe</p>
          </div>
          <div className="overViewInner orange">
            <img src={centerIcon} alt="" className="grid-ju-ce" />
            <h2 className="grid-ju-ce">
              {average.toLocaleString() >= 0
                ? average.toLocaleString() + " €"
                : "0 €"}
            </h2>
            <p className="grid-ju-ce">Mittelwert</p>
          </div>
          <div className="overViewInner">
            <img src={topIcon} alt="" className="grid-ju-ce" />
            <h2 className="grid-ju-ce">
              {maxSalary.toLocaleString() >= 0
                ? maxSalary.toLocaleString() + " €"
                : "0 €"}
            </h2>
            <p className="grid-ju-ce">Höchste Angabe</p>
          </div>
        </div>
        <div>
          <div className="Trennlinie"></div>
        </div>
        <h1>
          <span>Weitere </span>Details
        </h1>
        <div className="Filter-Group">
          <button
            className={
              activeFilter === "Alle"
                ? "Filter-Button Filtered-Active"
                : "Filter-Button"
            }
            onClick={() => onSetActiveFilter("Alle")}
          >
            {"Alle (" + entries.length + ")"}
          </button>
          <button
            className={
              activeFilter === "Frontend"
                ? "Filter-Button Filtered-Active"
                : "Filter-Button"
            }
            onClick={() => onSetActiveFilter("Frontend")}
          >
            {"Frontend (" + frontendCount.length + ")"}
          </button>
          <button
            className={
              activeFilter === "Backend"
                ? "Filter-Button Filtered-Active"
                : "Filter-Button"
            }
            onClick={() => onSetActiveFilter("Backend")}
          >
            {"Backend (" + backEndCount.length + ")"}
          </button>
          <button
            className={
              activeFilter === "Full-Stack"
                ? "Filter-Button Filtered-Active"
                : "Filter-Button"
            }
            onClick={() => onSetActiveFilter("Full-Stack")}
          >
            {"Full-Stack (" + fullStackCount.length + ")"}
          </button>
        </div>
        <MobileTable
          allEntries={activeFilter === "Alle" ? entries : filteredEntries}
          mainAverage={average}
        />
        <div>
          <div className="Trennlinie"></div>
        </div>
        <h1>
          <span>Offene </span>Stellen
        </h1>
        <JobsList jobs={jobs} />
      </div>
      <Footer />
      <MessengerChat
        pageId="103195915190910"
        language="de_DE"
        themeColor={"#ff5a36"}
      />
    </div>
  );
}

export default App;
