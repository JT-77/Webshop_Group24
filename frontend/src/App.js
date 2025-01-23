import logo from "./logo.svg";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProductCatalog from "./Pages/ProductCatalog";

function App() {
	return (
		<div className="App">
			<Header />
			<ProductCatalog />
			<Footer />
		</div>
	);
}

export default App;
