import {createContext} from "react";

class DummyApplication extends Application {}
let AppContext = createContext<Application>(new DummyApplication());
export default AppContext