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
    // addDoc(collectionRef, payload);
    displaySuccess();
    console.log(payload);
    form.reset();
  }

  useEffect(() => {
    const isunsubscribe = onSnapshot(
      query(collection(firebase, "all"), orderBy("timestamp", "asc")),
      (snapshot) => {
        setEntries(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
    // console.log(average);
  }, [entries]);

  useEffect(() => {
    let salaries = entries.map((item) => item.thefee);
    setMinSalary(Math.min(...salaries));
    setMaxSalary(Math.max(...salaries));
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
          {/* <div className="Input-Wrapper"> */}
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
          {/* </div> */}
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
        {/* {console.log(average)} */}
        <div className="overViewWrapper">
          <div className="overViewInner">
            <img src={bottomIcon} alt="" className="grid-ju-ce" />
            <h2 className="grid-ju-ce">{minSalary.toLocaleString() + " €"}</h2>
            <p className="grid-ju-ce">Niedrigste Angabe</p>
          </div>
          <div className="overViewInner orange">
            <img src={centerIcon} alt="" className="grid-ju-ce" />
            <h2 className="grid-ju-ce">{average.toLocaleString() + " €"}</h2>
            <p className="grid-ju-ce">Mittelwert</p>
          </div>
          <div className="overViewInner">
            <img src={topIcon} alt="" className="grid-ju-ce" />
            <h2 className="grid-ju-ce">{maxSalary.toLocaleString() + " €"}</h2>
            <p className="grid-ju-ce">Höchste Angabe</p>
          </div>
        </div>
        <div>
          <div className="Trennlinie"></div>
        </div>
        <h1>
          <span>Weitere </span>Details
        </h1>
        {/* <div className="entries">
          <div className="TableHeader">
            <h4>Stelle:</h4>
            <h4>Standort:</h4>
            <h4>Alter:</h4>
            <h4>Gehalt:</h4>
            <h4>Berufserfahrung:</h4>
            <h4>Quereinsteiger:</h4>
          </div>
          {!isLoaded ? (
            <div className="Loader-Wrapper">
              <img
                src={reloadIcon}
                alt="Reload Icon"
                className="Loading-Spinner"
              />
            </div>
          ) : (
            ""
          )}
          {entries.map((entry, index) => (
            <div key={index} className="entry-zeile">
              <p>{entry.thejob}</p>
              <p>{entry.loc}</p>
              <p>{entry.theage}</p>
              <p>{entry.thefee.toLocaleString() + " €"}</p>
              <p>
                {entry.theexperience === 0
                  ? "< 1 Jahr"
                  : entry.theexperience === 1
                  ? "1 Jahr"
                  : entry.theexperience + " Jahre"}
              </p>
              <p>
                {entry.thenewbie === 0
                  ? "Ja"
                  : entry.thenewbie === 1
                  ? "Nein"
                  : "Nicht bekannt!"}
              </p>
            </div>
          ))}
        </div> */}
        <MobileTable allEntries={entries} mainAverage={average} />
      </div>
      <div className="Footer">
        <h4>©Fabian Hanso 2022</h4>
        {/* <a href="">GitHub</a> */}
      </div>
    </div>
  );
}

export default App;
