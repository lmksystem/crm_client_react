import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from 'reactstrap';
import SimpleBar from "simplebar-react";
import { getCollaborateurs as onGetCollaborateurs } from "../../slices/thunks";
import { useDispatch, useSelector } from 'react-redux';

const SearchOption = () => {
    const [searchValue, setSearchValue] = useState("");
    const dispatch = useDispatch();
    const { collaborateurs } = useSelector((state) => ({
        collaborateurs: state.Gestion.collaborateurs,
    }));

    
    useEffect(() => {
        var searchOptions = document.getElementById("search-close-options");
        var dropdown = document.getElementById("search-dropdown");
        var searchInput = document.getElementById("search-options");

        searchInput.addEventListener("focus", function () {
            var inputLength = searchInput.value.length;
            if (inputLength > 0) {
                dropdown.classList.add("show");
                searchOptions.classList.remove("d-none");
            } else {
                dropdown.classList.remove("show");
                searchOptions.classList.add("d-none");
            }
        });

        searchInput.addEventListener("keyup", function () {
            var inputLength = searchInput.value.length;
            if (inputLength > 0) {
                dropdown.classList.add("show");
                searchOptions.classList.remove("d-none");
            } else {
                dropdown.classList.remove("show");
                searchOptions.classList.add("d-none");
            }
        });

        searchOptions.addEventListener("click", function () {
            searchInput.value = "";
            dropdown.classList.remove("show");
            searchOptions.classList.add("d-none");
        });

        document.body.addEventListener("click", function (e) {
            if (e.target.getAttribute('id') !== "search-options") {
                dropdown.classList.remove("show");
                searchOptions.classList.add("d-none");
            }
        });
    }, []);


    useEffect(() => {
        dispatch(onGetCollaborateurs());
    }, [dispatch]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchValue(value);
    };

    const filteredCollaborateurs = collaborateurs.filter(collabo =>
        collabo?.ent_firstname?.toLowerCase().includes(searchValue) ||
        collabo?.ent_lastname?.toLowerCase().includes(searchValue) ||
        collabo?.ent_name?.toLowerCase().includes(searchValue)
    );

    return (
        <React.Fragment>
            <form className="app-search d-none d-md-block">
                <div className="position-relative">
                    <Input
                    id="search-options"
                        type="text"
                        className="form-control"
                        placeholder="Rechercher..."
                        value={searchValue}
                        onInput={handleSearch}
                    />
                    <span className="mdi mdi-magnify search-widget-icon"></span>
                    <span className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none" id="search-close-options"></span>
                </div>
                <div className="dropdown-menu dropdown-menu-lg" id="search-dropdown">
                    <SimpleBar style={{ height: "320px" }}>
                        <div className="dropdown-header mt-2">
                            <h6 className="text-overflow text-muted mb-2 text-uppercase">Clients / Fournisseurs</h6>
                        </div>
                        <div className="notification-list">
                            {
                                filteredCollaborateurs.map((collabo, index) => (
                                    <Link to="#" className="dropdown-item notify-item py-2" key={index}>
                                        <div className="d-flex">
                                            <div className="flex-1">
                                                <h6 className="m-0">{collabo?.ent_firstname} {collabo?.ent_lastname}</h6>
                                                <h6 className="m-0">{collabo?.ent_name}</h6>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            }
                        </div>
                    </SimpleBar>
                </div>
            </form>
        </React.Fragment>
    );
};

export default SearchOption;