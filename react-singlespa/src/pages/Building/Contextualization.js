
import React, {useState} from 'react';
import {  Row, Col } from "reactstrap";



const Contextualization = () => {
    const [rows,setRows] = useState([]);
    const [filterParams, setFilterParams] = useState();

    const handleFilterChange = (filterParams) => {
        setFilterParams(filterParams)
      }
    

    const handleRowsChange = (rows) => {
        setRows(rows);
        //setTotalNumberOfRows(rows.length);
      };


    return (
        <div>
            <Row>
                <Col>
                    <FilterUI  onFilterChange={handleFilterChange} />
                </Col>
                <Col>
                    <ApplyTagForm  rows={rows} setRows={setRows} />
                </Col>
            </Row>
            <PointsTable
                              filterParams={filterParams}
                              onRowsChange={handleRowsChange}
                            />

        </div>
    )
}

export default Contextualization
