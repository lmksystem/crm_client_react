import React, { Fragment, useRef } from "react";
import PropTypes from "prop-types";
import { useTable, useGlobalFilter, useAsyncDebounce, useSortBy, useFilters, useExpanded, usePagination, useRowSelect } from "react-table";
import { Table, Row, Col, Button, Input, CardBody } from "reactstrap";
import Flatpickr from "react-flatpickr";

import { DefaultColumnFilter } from "./filters";
import { ProductsGlobalFilter, CustomersGlobalFilter, OrderGlobalFilter, LeadsGlobalFilter, CryptoOrdersGlobalFilter, InvoiceListGlobalSearch, TicketsListGlobalFilter, NFTRankingGlobalFilter, TaskListGlobalFilter } from "../../Components/Common/GlobalSearchFilter";
import { Navigate, useNavigate } from "react-router-dom";
import * as moment from "moment";

// Define a default UI for filtering
export function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter, perdiodeCalendar, setPeriodeCalendar, selectFilter }) {
  const [value, setValue] = React.useState(globalFilter);
  const flatpickrRef = useRef();

  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <React.Fragment>
      <CardBody className="border border-dashed border-end-0 border-top-0 border-start-0">
        <form>
          <Row className="g-3">
            <Col>
              <div className={"search-box me-2 mb-2 d-inline-block"}>
                <input
                  onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                  }}
                  id="search-bar-0"
                  type="text"
                  className="form-control search /"
                  placeholder={`Recherche...`}
                  value={value || ""}
                />
                <i className="bx bx-search-alt search-icon"></i>
              </div>
              {selectFilter && (
                <div className={"search-box d-inline-block"}>
                  <Input
                    type="select"
                    className="form-select mb-0"
                    value={selectFilter.value}
                    onChange={selectFilter.handleChange}
                  // onBlur={validation.handleBlur}
                  >
                    <option value={"null"}>Filtrer par {selectFilter.by}</option>
                    {selectFilter?.data.map((e, i) => (
                      <option
                        key={i}
                        value={e.value}>
                        {e.value}
                      </option>
                    ))}
                  </Input>
                </div>
              )}
            </Col>

            {setPeriodeCalendar && perdiodeCalendar && (
              <Col>
                {/* <div className="mt-lg-0"> */}
                {/* <form action="#"> */}
                <Row className=" mb-0 align-items-center justify-content-end ">
                  <div className="col-sm-auto d-flex align-items-center flex-row">
                    {flatpickrRef.current?.flatpickr?.selectedDates?.length > 0 && (
                      <i
                        className="las la-calendar-times la-lg me-3"
                        onClick={() => {
                          setPeriodeCalendar(
                            {
                              start: null,
                              end: null
                            },
                            true
                          );
                          flatpickrRef.current.flatpickr.clear();
                        }}
                        style={{ color: "red" }}></i>
                    )}
                    {/* <div className="input-group"> */}
                    <Flatpickr
                      ref={flatpickrRef}
                      className="form-control border-0 fs-13 dash-filter-picker shadow flex-row"
                      options={{
                        locale: "fr",
                        mode: "range",
                        dateFormat: "d M, Y",
                        defaultDate: [perdiodeCalendar?.start, perdiodeCalendar?.end]
                      }}
                      onChange={(periodDate) => {
                        if (periodDate.length == 2) {
                          setPeriodeCalendar(
                            {
                              start: moment(periodDate[0]).format("YYYY-MM-DD"),
                              end: moment(periodDate[1]).format("YYYY-MM-DD")
                            },
                            true
                          );
                        } else if (periodDate.length == 1) {
                          setPeriodeCalendar(
                            {
                              start: moment(periodDate[0]).format("YYYY-MM-DD"),
                              end: moment(periodDate[0]).format("YYYY-MM-DD")
                            },
                            true
                          );
                        } else {
                          setPeriodeCalendar(
                            {
                              start: null,
                              end: null
                            },
                            true
                          );
                        }
                      }}
                    />
                    <div className="input-group-text bg-secondary border-secondary text-white">
                      <i className="ri-calendar-2-line"></i>
                    </div>
                  </div>
                  {/* </div> */}
                </Row>
                {/* </form> */}
                {/* </div> */}
              </Col>
            )}
          </Row>
        </form>
      </CardBody>
    </React.Fragment>
  );
}

const TableContainer = ({
  columns,
  data,
  isGlobalSearch,
  isGlobalFilter,
  isProductsFilter,
  isCustomerFilter,
  isOrderFilter,
  isContactsFilter,
  isCompaniesFilter,
  isLeadsFilter,
  isCryptoOrdersFilter,
  isInvoiceListFilter,
  isTicketsListFilter,
  isNFTRankingFilter,
  isTaskListFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  pathToDetail,
  actionItem,
  setPeriodeCalendar,
  perdiodeCalendar,
  selectFilter
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      autoResetPage: false,
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        selectedRowIds: 0,
        sortBy: [
          {
            desc: true
          }
        ]
      }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  let navigate = useNavigate();

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? " " : "") : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };
  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  return (
    <Fragment>
      <Row className="mb-3">
        {isGlobalSearch && (
          <Col md={1}>
            <select
              className="form-select"
              value={pageSize}
              onChange={onChangeInSelect}>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option
                  key={pageSize}
                  value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        )}
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            isProductsFilter={isProductsFilter}
            isCustomerFilter={isCustomerFilter}
            isOrderFilter={isOrderFilter}
            isContactsFilter={isContactsFilter}
            isCompaniesFilter={isCompaniesFilter}
            isLeadsFilter={isLeadsFilter}
            isCryptoOrdersFilter={isCryptoOrdersFilter}
            isInvoiceListFilter={isInvoiceListFilter}
            isTicketsListFilter={isTicketsListFilter}
            isNFTRankingFilter={isNFTRankingFilter}
            isTaskListFilter={isTaskListFilter}
            setPeriodeCalendar={setPeriodeCalendar}
            perdiodeCalendar={perdiodeCalendar}
            selectFilter={selectFilter}
          />
        )}
      </Row>

      <div
        className={divClass}
        style={{ minHeight: 230 }}>
        <Table

          hover
          {...getTableProps()}
          className={tableClass}>
          <thead className={theadClass}>
            {headerGroups.map((headerGroup) => (
              <tr
                className={trClass}
                key={headerGroup.id}
                {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    className={thClass}
                    {...column.getSortByToggleProps()}>
                    <p
                      style={{ color: "#00a34c" }}
                      className="m-0">
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </p>
                    {/* <Filter column={column} /> */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              let key = "";
              if (pathToDetail) {
                key = Object.keys(row.original.header).find((e) => e.includes("en_id"));
              }
              // console.log(row.Cells)
              return (
                <Fragment key={row.getRowProps().key}>
                  <tr
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (pathToDetail) {
                        navigate(pathToDetail + row.original.header[key]);
                      }
                    }}>
                    {row.cells.map((cell) => {

                      return (
                        <td
                          key={cell.id}
                          onClick={() => {
                            if (actionItem && cell.column.id != "Action" && cell.column.id != "checkDelete") {
                              actionItem(row);
                            }
                          }}
                          {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
        {page.length == 0 && (
          <div style={{ position: "absolute", width: "100%", display: "flex", justifyContent: "center" }}>
            <p style={{ margin: "15px", fontWeight: 600, fontSize: "15px", color: "gray" }}>
              <i>Aucune donnée à afficher</i>
            </p>
          </div>
        )}
      </div>

      <Row className="justify-content-md-end justify-content-center align-items-center p-2">
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              color="primary"
              onClick={previousPage}
              disabled={!canPreviousPage}>
              {"<"}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          Page{" "}
          <strong>
            {pageIndex + 1} sur {pageOptions.length}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            type="number"
            min={1}
            style={{ width: 70 }}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={onChangeInInput}
          />
        </Col>

        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              color="primary"
              onClick={nextPage}
              disabled={!canNextPage}>
              {">"}
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any
};

export default TableContainer;
