import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { utils } from "near-api-js";
import { Card, Button, Col, Badge, Stack, Row, Form, Table } from "react-bootstrap";
import { formatNearAmount, parseNearAmount } from "near-api-js/lib/utils/format";
import {
  getTippers as getTippersList
} from "../../utils/tipme";
import Loader from "../utils/Loader";

const TippedAccount = ({ account, withdraw, tip, disable, activate }) => {
  const { name, description, total_amount, active, owner } =
    account;

  const [tipamount, setTipamount] = useState(0);
  const [message, setMessage] = useState("");
  const [tippers, setTippers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTippers = useCallback(async () => {
    try {
      setLoading(true);
      setTippers(await getTippersList({name}));      
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const triggerTip = () => {
    tip(name, parseNearAmount(tipamount + ""), message);
  };

  const triggerWithdraw = () => {
    withdraw(name);
  };

  const triggerDisable = () => {
    disable(name);
  }

  const triggerActivate = () => {
    activate(name);
  }

  useEffect(() => {
    getTippers();
  }, []);

  return (
    <Col key={name}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-secondary">{owner}</span>
            { active ?
              <Badge bg="success" className="ms-right">
                Active
              </Badge>
              :
              <Badge bg="danger" className="ms-right">
                Inactive
              </Badge>
            }
            <Badge bg="secondary" className="ms-auto">
              {utils.format.formatNearAmount(total_amount)} NEAR
            </Badge>
          </Stack>
        </Card.Header>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="flex-grow-1 ">{description}</Card.Text>
          <hr />
          {loading ? (<Loader />) : 
            tippers.length === 0 ? (<p>No Tipper yet!!!</p>) 
            :
            (
              <Table borderless>
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Message</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tippers.map((_tipper) =>
                      <tr>
                        <td>{_tipper.from}</td>
                        <td>{_tipper.message}</td>
                        <td>{formatNearAmount(_tipper.amount)} NEAR</td>
                      </tr>
                  )}
                </tbody>
              </Table>
            )}
          <hr />
          { (window.accountId === owner) ?
              <Row xs={2} sm={2} lg={2} className="g-3 mt-2 mb-1 g-xl-4 g-xxl-5">
                <Col>
                  <Button
                    variant={utils.format.formatNearAmount(total_amount)==="0" ? "outline-secondary" : "outline-success"}
                    onClick={triggerWithdraw}
                    className="w-100 py-3"
                    disabled={utils.format.formatNearAmount(total_amount)==="0"}
                  >
                    Withdraw
                  </Button>
                </Col>
                <Col>
                  { active ? 
                    <Button
                      variant="outline-danger"
                      onClick={triggerDisable}
                      className="w-100 py-3"
                    >
                      Disable
                    </Button>
                    :
                    <Button
                      variant="outline-danger"
                      onClick={triggerActivate}
                      className="w-100 py-3"
                    >
                      Activate
                    </Button>
                  }
                  
                </Col>
              </Row>
            :
            <Row className="g-3 mt-2 mb-1 g-xl-4 g-xxl-5">
              <Col sm={12}>
                <Form.Group controlId="formMessage">
                  <Form.Control className="py-3" type="text" 
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    placeholder="Message"/>
                </Form.Group>
              </Col>
              <Col>
                <Form>
                  <Form.Group controlId="formNearAmount">
                    <Form.Control className="py-3" type="text" 
                      onChange={(e) => {
                        setTipamount(e.target.value);
                      }}
                      placeholder="NEAR Amount"/>
                  </Form.Group>
                </Form>
              </Col>
              <Col>
                <Button
                  variant="outline-dark"
                  onClick={triggerTip}
                  className="w-100 py-3"
                >
                  Tip
                </Button>
              </Col>
            </Row>
          }
        </Card.Body>
      </Card>
    </Col>
  );
};

TippedAccount.propTypes = {
  account: PropTypes.instanceOf(Object).isRequired,
  withdraw: PropTypes.func.isRequired,
  tip: PropTypes.func.isRequired,
};

export default TippedAccount;