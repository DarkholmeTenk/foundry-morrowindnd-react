import {createContext} from "react";

class DummyApplication extends Application {}
let ApplicationContext = createContext<Application>(new DummyApplication());
export default ApplicationContext