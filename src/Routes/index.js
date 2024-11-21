import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { adminRoute, authProtectedRoutes, publicRoutes, userRoute } from "./allRoutes";
import { AuthProtected } from "./AuthProtected";
import { AdminProtected } from "./AdminProtected";
import { useSelector } from "react-redux";

const Index = () => {
  const { user } = useSelector((state) => ({
    user: state.Login.user
  }));

  return (
    <React.Fragment>
      <Routes>
        <Route>
          {user &&
            user.use_rank == 1 &&
            adminRoute.map((route, idx) => (
              <Route
                path={route.path}
                element={
                  <AdminProtected
                    rank={route.rank}
                    adminRouteIndex={adminRoute[idx]}>
                    <VerticalLayout>{route.component}</VerticalLayout>
                  </AdminProtected>
                }
                key={idx}
                exact={true}
              />
            ))}
        </Route>
        <Route>
          {/* rank utilisateur */}
          {user &&
            (user.use_rank == 0 || user.use_rank == 3) &&
            userRoute.map((route, idx) => {
              return (
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
              );
            })}
        </Route>

        <Route>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
              exact={true}
            />
          ))}
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default Index;
