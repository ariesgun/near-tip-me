import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddAccount from "./AddAccount";
import TippedAccount from "./TippedAccount";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notification";
import {
  createAccount,
  getAccounts as getAccountList,
  tip as tipAccount,
  withdraw as withdrawAccount,
  disable as disableAccount,
  activate as activateAccount,
} from "../../utils/tipme";

const TippedAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setAccounts(await getAccountList());      
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const saveAccount = async (data) => {
    try {
      setLoading(true);
      createAccount(data).then((resp) => {
        getAccounts();
      });
      toast(<NotificationSuccess text="Account added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an account." />);
    } finally {
      setLoading(false);
    }
  };
  
  const tip = async (name, amount, message) => {
    try {
      await tipAccount({
        name,
        amount,
        message
      }).then((resp) => getAccounts());
      toast(<NotificationSuccess text="Account tipped successfully" />);
    } catch (error) {
      toast(<NotificationError text="Failed to give tip." />);
    } finally {
      setLoading(false);
    }
  };

  const disable = async (name) => {
    try {
      await disableAccount({
        name
      }).then((resp) => getAccounts());
      toast(<NotificationSuccess text="Account disabled successfully" />);
    } catch (error) {
      toast(<NotificationError text="Failed to disable account." />);
    } finally {
      setLoading(false);
    }
  };

  const activate = async (name) => {
    try {
      await activateAccount({
        name
      }).then((resp) => getAccounts());
      toast(<NotificationSuccess text="Account activated successfully" />);
    } catch (error) {
      toast(<NotificationError text="Failed to activate account." />);
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (name) => {
    try {
      await withdrawAccount({
        name
      }).then((resp) => getAccounts());
      toast(<NotificationSuccess text="Withdrawn successfully" />);
    } catch (error) {
      console.log(error);
      toast(<NotificationError text="Failed to wtihdraw tips." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  return (
      <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">List of Accounts</h1>
              <AddAccount save={saveAccount} />
            </div>
            <Row xs={1} sm={1} lg={1} className="g-3 mb-5 g-xl-4 g-xxl-5">
              {accounts.map((_account) => {
                return (
                  <TippedAccount
                    account={{
                      ..._account,
                    }}
                    withdraw={withdraw}
                    tip={tip}
                    disable={disable}
                    activate={activate}
                  />
                );
                }
              )}
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  };

export default TippedAccounts;