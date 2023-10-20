import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { adminRoute, authProtectedRoutes, publicRoutes, userRoute } from "./allRoutes";
import { AuthProtected } from './AuthProtected';
import { useProfile } from '../Components/Hooks/UserHooks';
import { AdminProtected } from './AdminProtected';


const Index = () => {

  return (
    <React.Fragment>
      <Routes>
        <Route>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <NonAuthLayout>
                  {route.component}
                </NonAuthLayout>
              }
              key={idx}
              exact={true}
            />
          ))}
        </Route>


        <Route>

          {
            adminRoute.map((route, idx) => (
              <Route
                path={route.path}
                element={
                  <AdminProtected rank={route.rank}>
                    <VerticalLayout>{route.component}</VerticalLayout>
                  </AdminProtected>
                }
                key={idx}
                exact={true}
              />
            ))
          }

        </Route>
        <Route>

          {
            userRoute.map((route, idx) => (
              <Route
                path={route.path}
                element={
                  <AuthProtected rank={route.rank}>
                    <VerticalLayout>{route.component}</VerticalLayout>
                  </AuthProtected>
                }
                key={idx}
                exact={true}
              />
            ))
          }

        </Route>
        
      </Routes>
    </React.Fragment>
  );
};

export default Index;