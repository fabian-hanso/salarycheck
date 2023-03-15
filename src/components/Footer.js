import "../App.css";
import DonationImage from "../images/currency-usd.svg";

function Footer() {
  return (
    <div className="Footer">
      <h4>©Fabian Hanso 2022</h4>
      <div className="button-grid">
        <a
          href="https://paypal.me/FabianHanso?country.x=DE&locale.x=de_DE"
          className="Footer-Link-Wrapper"
        >
          <img src={DonationImage} alt="Donations Link" />
          Donation
        </a>
      </div>
    </div>
  );
}

export default Footer;
