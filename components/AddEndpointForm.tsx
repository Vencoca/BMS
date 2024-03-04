import { Alert, Box, Button, CircularProgress, Snackbar, TextField } from "@mui/material";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface Form {
    url: string
    secret: string
}

export default function AddEndpointForm() {
    const [apiInProgress, setApiInProgress] = useState(false)
    const [error, setError] = useState("")
    const [open, setOpen] = useState(false);
    const { control, handleSubmit, reset, formState: { errors }, } = useForm({
        defaultValues: {
            url: "",
            secret: "",
        },
        mode: "onBlur",
    })
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        setOpen(false);
    };
    const onSubmit: SubmitHandler<Form> = async (data) => {

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box minWidth="280px" sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <Controller
                    name="url"
                    control={control}
                    rules={{
                        required: { value: true, message: "Url is required!" },
                    }}
                    render={({ field }) => <TextField {...field} error={errors["url"] && true} label={errors["url"]?.message || "Url"} variant="outlined" />}
                />
                <Controller
                    name="secret"
                    control={control}
                    rules={{
                        required: { value: true, message: "Secret is required!" },
                    }}
                    render={({ field }) => <TextField {...field} error={errors["secret"] && true} label={errors["secret"]?.message || "Secret"} type={"password"} variant="outlined" />}
                />
                {error !== "" && (
                    <Snackbar
                        open={open}
                        autoHideDuration={5000}
                        onClose={handleClose}
                        message={error}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Alert
                            onClose={handleClose}
                            severity="error"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {error}
                        </Alert>
                    </Snackbar>
                )}
                <Button type="submit" variant="contained" sx={{ width: "100%", }} disabled={apiInProgress}>{apiInProgress ? <CircularProgress size={24} /> : "Add endpoint"}</Button>
            </Box>
        </form>
    )
}