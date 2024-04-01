import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import ButtonSolid from "../ButtonSolid";
import { useMutation } from "@apollo/client";
import { DEPOSIT_TO_WALLET } from "@/apollo/mutations/wallet";
import { ToastContainer, toast } from "react-toastify";


const MobileMoney = () => {
  const [selected, setSelected] = useState("");

  const [depositAmount, setDepositAmount] = useState(0)

  const [deposit, { loading }] = useMutation(DEPOSIT_TO_WALLET)


  const depositFunds = async () => {
    if(depositAmount < 10) {
      toast.error('Minimum deposit amount is 10 cedis')
      return
    }

    try {
     const amountDeposited = await deposit({
        variables: {
          amount: depositAmount
        }
      })
      setDepositAmount(0)
      toast.success('Deposit successful')
    } catch (error:any) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    setSelected(event.target.value);
  };

  return (
    <div>
      <ToastContainer />


      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <p className="font-medium text-[1.2rem] text-[#595862] ">
            Payment Info
          </p>

          <div>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
              <InputLabel id="demo-simple-select-helper-label">
                Provider
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={selected}
                label="Provider"
                onChange={handleChange}
              >
                <MenuItem value={"Mtn Mobile Money"}>Mtn Mobile Money</MenuItem>
                <MenuItem value={"AirtelTigo Cash"}>AirtelTigo Cash</MenuItem>
                <MenuItem value={"Telecel Cash"}>Telecel Cash</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="h-[3.7rem] w-[20rem] border rounded-md p-2 flex flex-col justify-center ">
          <p className="text-[#63626C] text-[.9rem] ">Mobile Number</p>
          <div className="flex items-center space-x-2 text-sm">
            <p>+233</p>
            <input
              type="number"
              className="border-0 outline-none text-[#63626C] "
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-6">
        <p className="font-medium text-[1.2rem] text-[#595862] ">
          Amount (USD)
        </p>

        <div className="h-[3rem] w-[300px] border flex items-center px-2 rounded-lg ">
          <input onChange={(e) => setDepositAmount(parseFloat(e.target.value))} placeholder="min. 10.00" type="number" className="border-0 outline-none w-full  " />
        </div>
      </div>

      <div className="w-full flex justify-end" >
        <ButtonSolid onClick={depositFunds} className="my-[2rem] " title="Top Up Now" />
      </div>

      <div className="w-full border-t pt-[2rem] text-[#595862] " >
        <p className="font-medium text-[1.1rem] " >Note</p>
        <p className="text-sm" >1. Maximum per transaction is GHS 50,000</p>
        <p className="text-sm" >2. Minimum per transaction is GHS 10</p>
        <p className="text-sm" >3. Deposit is free, no transaction fees.</p>
        <p className="text-sm" >4. Your number can only be withdrawn to the mobile number you registered with.</p>
      </div>
    </div>
  );
};

export default MobileMoney;
