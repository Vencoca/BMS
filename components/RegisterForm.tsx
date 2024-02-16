import { Box, Button, TextField } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form"


interface Form {
    email: string
    password: string
}

export default function RegisterFrom() {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit: SubmitHandler<Form> = (data) => {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box minWidth="280px" sx={{display: "flex", flexDirection: "column", gap: "16px"}}>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => <TextField {...field} label="E-mail" variant="outlined" />}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Password" variant="outlined" />}
                />
                <Button type="submit" variant="contained" sx={{ width: "100%", }}>Register</Button>
            </Box>
        </form>
    )
}