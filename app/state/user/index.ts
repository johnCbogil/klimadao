import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  // keep it raw, bignumber, so we can do math safely
  balance?: {
    klima: string;
    sklima: string;
    aklima: string;
    alklima: string;
    bct: string;
    pklima: string;
    pklimaClaimed: string;
    pklimaMax: string;
    pklimaVestable: string;
  };
  migrateAllowance?: {
    aklima: string;
    alklima: string;
  };
  exerciseAllowance?: {
    pklima: string;
    bct: string;
  };
  stakeAllowance?: {
    klima: string;
    sklima: string;
  };
  bondAllowance?: {
    bct: string;
    klima_bct_lp: string;
    bct_usdc_lp: string;
  };
}

const initialState: UserState = {
  balance: undefined,
  migrateAllowance: undefined,
  exerciseAllowance: undefined,
  stakeAllowance: undefined,
  bondAllowance: undefined,
};

/** Helper type to reduce boilerplate */
type Setter<P extends keyof UserState> = PayloadAction<
  NonNullable<UserState[P]>
>;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setBalance: (s, a: Setter<"balance">) => {
      s.balance = { ...s.balance, ...a.payload };
    },
    setMigrateAllowance: (s, a: Setter<"migrateAllowance">) => {
      s.migrateAllowance = { ...s.migrateAllowance, ...a.payload };
    },
    setExerciseAllowance: (s, a: Setter<"exerciseAllowance">) => {
      s.exerciseAllowance = { ...s.exerciseAllowance, ...a.payload };
    },
    setStakeAllowance: (s, a: Setter<"stakeAllowance">) => {
      s.stakeAllowance = { ...s.stakeAllowance, ...a.payload };
    },
    setBondAllowance: (s, a: Setter<"bondAllowance">) => {
      s.bondAllowance = { ...s.bondAllowance, ...a.payload };
    },
  },
});

export const {
  setBalance,
  setMigrateAllowance,
  setExerciseAllowance,
  setStakeAllowance,
  setBondAllowance,
} = userSlice.actions;

export default userSlice.reducer;
