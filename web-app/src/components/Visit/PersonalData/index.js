import React from "react";
import {
    Grid,
    TextField,
    Backdrop,
    CircularProgress,
    Button,
    ButtonGroup,
     Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@material-ui/core';
import TitleStepper from '../../Typography/TitleStepper'
import { makeStyles } from '@material-ui/core/styles';
import RadioButtonsGroup from "../../RadioGroup";
import CheckboxComponent from "../../Checkbox";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useAuth } from "../../../contexts/AuthContext";
import strings from "../../Language/";
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    paper: {
        borderRadius: 24,
        padding: theme.spacing(3),
    }
}))

export function PersonalData(props) {
    const { onClickBack, onClickNext, patient, pageName, visit } = props;
    const [state, setState] = React.useState({
        patientId: patient,
        patientAge: 0,
        gender: "male",
        patientOccupation: '',
        educationalQualification: '',
        maritalStatus: '',
        ethnicity: '',
        consent: false,
        backdrop: false,
    })

    const classes = useStyles()

    const {
        pushPatientVisitData,
        pullPatientVisitData,
        currentLanguage,
    } = useAuth();

    const handleGenderChange = (name, value) => setState(s => ({ ...s, [name]: value }))

    const handleSwitchChange = (name, value) => setState((s) => ({ ...s, [name]: value }))

    const handleTextfieldChange = ({ target }) => setState((s) => ({ ...s, [target.name]: target.value }))

    const handleSelectChange = ({ target }) => setState(s => ({ ...s, [target.name]: target.value }))
    
    const isMountedRef = React.useRef(null);

    React.useEffect(() => {
        const fetchData = async (id) => {
            if (isMountedRef.current)
                setState(s => ({ ...s, backdrop: true }));

            try {
                const snapshot = await pullPatientVisitData(visit, id);
                if (snapshot.exists()) {
                    const result = snapshot.data();
                    if (isMountedRef.current) {
                        setState(s => {
                            // console.debug('gender', result.gender);
                            return ({
                                ...s,
                                backdrop: false,
                                // patientId: result.patientId,
                                patientAge: result.patient_age || '',
                                gender: result.gender || "male",
                                patientOccupation: result.patient_occupation || '',
                                educationalQualification: result.educational_qualification || '',
                                maritalStatus: result.marital_status || '',
                                ethnicity: result.ethnicity || '',
                                consent: result.consent || false,
                            })
                        })
                    }
                } else
                    if (isMountedRef.current)
                        setState(s => ({ ...s, backdrop: false }))

            } catch (error) {
                if (isMountedRef.current) {
                    setState(s => ({ ...s, backdrop: false }))
                }
                console.error(error)
            }
        }
        isMountedRef.current = true;
        fetchData(patient);
        return () => (isMountedRef.current = false)
    }, [visit, patient, pullPatientVisitData]);

    
    const handleNextClick = async () => {

        const {
            // patientId,
            patientAge,
            patientOccupation,
            educationalQualification,
            maritalStatus,
            ethnicity,
            consent,
            gender,
        } = state;

        const data = {
            // patientId: patientId,
            patient_age: parseInt(patientAge),
            patient_occupation: patientOccupation,
            educational_qualification: educationalQualification,
            marital_status: maritalStatus,
            ethnicity: ethnicity,
            consent: consent,
            gender: gender,
        }

        try {
            await pushPatientVisitData(data, visit, patient);

            onClickNext();
        } catch (error) {
            console.error(error);
        }
    }

    const handleBackClick = () => onClickBack()

    const { backdrop } = state;

    if (backdrop) {
        return (
            <Backdrop timeout={1000} className={classes.backdrop} open={backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    return (
        <Grid
            id="visit-step"
            container
            spacing={1}
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
        >
            <Grid item xs={12} id="title-page-name">
                <TitleStepper>
                    {pageName}
                </TitleStepper>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    id="patient-id"
                    name="patientId"
                    value={state.patientId}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Patient ID"
                    margin="normal"
                    helperText="(non modificabile)"
                />

                <TextField
                    id="patient-age"
                    name="patientAge"
                    label={strings.measures.age}
                    value={state.patientAge}
                    onChange={handleTextfieldChange}
                    type="number"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                />

                <TextField
                    id="patient-occupation "
                    name="patientOccupation"
                    label={strings.patient.occupation}
                    value={state.patientOccupation}
                    onChange={handleTextfieldChange}
                    type="text"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                />
                <FormControl variant="outlined" fullWidth margin="dense" >
                    <InputLabel id="educational-qualification-select-label">
                        {strings.patient.educational_qualification}
                    </InputLabel>
                <Select
                        labelId=" educational-qualification-select-label"
                        id="educational-qualification-select"
                        value={state.educationalQualification}
                        name="educationalQualification"
                        label={strings.patient.educational_qualification}
                        onChange={handleSelectChange}
                        fullWidth
                        style={{ width: '100%', height: '55px' }}
                    >
                        <MenuItem value="">
                            <em>-</em>
                        </MenuItem>

                        <MenuItem key="key-menu-item-nessun-titolo/licenza-elementare" id="item-menu-nessun-titolo/licenza-elementare" value={'Nessun titolo/licenza elementare'} >
                            {"Nessun titolo/licenza elementare"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-licenza-media" id="item-menu-licenza-media" value={'Licenza media'} >
                            {"Licenza media"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-diploma-scuola-superiore" id="item-menu-diploma-scuola-superiore" value={'Diploma scuola superiore'} >
                            {"Diploma scuola superiore"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-diploma-professionale" id="item-menu-diploma-professionale" value={'Diploma professionale'} >
                            {"Diploma professionale"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-laurea-triennale" id="item-menu-laurea-triennale" value={'Laurea triennale'} >
                            {"Laurea triennale"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-laurea-magistrale" id="item-menu-laurea-magistrale" value={'Laurea magistrale'} >
                            {"Laurea magistrale"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-dottorato" id="item-menu-dottorato" value={'Dottorato'} >
                            {"Dottorato"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-altro" id="item-menu-altro" value={'Altro'} >
                            {"Altro"}
                        </MenuItem>
                    </Select>
                    </FormControl>

               

            
                 <FormControl variant="outlined" fullWidth margin="dense" >
                    <InputLabel id="marital-status-select-label">
                        {strings.patient.marital_status}
                    </InputLabel>
                    <Select
                        labelId="marital-status-select-label"
                        id="marital-status-select"
                        value={state.maritalStatus}
                        name="maritalStatus"
                        label={strings.patient.marital_status}
                        onChange={handleSelectChange}
                        fullWidth
                        style={{ width: '100%', height: '55px' }}
                    >
                        <MenuItem value="">
                            <em>-</em>
                        </MenuItem>

                        <MenuItem key="key-menu-item-celibe/nubile" id="item-menu-celibe/nubile" value={'Celibe/Nubile'} >
                            {"Celibe/Nubile"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-coniugato/a" id="item-menu-coniugato/a" value={'Coniugato/a'} >
                            {"Coniugato/a"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-vedovo/a" id="item-menu-vedovo/a" value={'Vedovo/a'} >
                            {"Vedovo/a"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-divorziato/a" id="item-menu-divorziato/a" value={'Divorziato/a'} >
                            {"Divorziato/a"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-unito-civilmente" id="item-menu-unito-civilmente" value={'Unito civilmente'} >
                            {"Unito civilmente"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-sposato/a" id="item-menu-sposato/a" value={'Sposato/a'} >
                            {"Spoato/a"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-convivente" id="item-menu-convivente" value={'Convivente'} >
                            {"Convivente"}
                    </MenuItem>
                    
                    </Select>
                </FormControl>
                
           

                <FormControl variant="outlined" fullWidth margin="dense" >
                    <InputLabel id="ethnicity-select-label">
                        {strings.patient.ethnicity}
                    </InputLabel>
                    <Select
                        labelId="ethnicity-select-label"
                        id="ethnicity-status-select"
                        value={state.ethnicity}
                        name="ethnicity"
                        label={strings.patient.ethnicity}
                        onChange={handleSelectChange}
                        fullWidth
                        style={{ width: '100%', height: '55px' }}
                    >
                        <MenuItem value="">
                            <em>-</em>
                        </MenuItem>

                        <MenuItem key="key-menu-item-etnia-han" id="item-menu-etnia-han" value={'Etnia Han'} >
                            {"Etnia Han"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-etnia-indo-ariana" id="item-menu-etnia-indo-ariana" value={'Etnia Indo-Ariana'} >
                            {"Etnia Indo-Ariana"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-etnia-araba" id="item-menu-etnia-araba" value={'Etnia Araba'} >
                            {"Etnia Araba"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-etnia-bantu" id="item-menu-etnia-bantu" value={'Etnia Bantu'} >
                            {"Etnia Bantu"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-etnia-europea" id="item-menu-etnia-europea" value={'Etnia-europea'} >
                            {"Etnia Europea"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-etnia-malay" id="item-menu-etnia-malay" value={'Etnia Malay'} >
                            {"Etnia Malay"}
                    </MenuItem>
                    <MenuItem key="key-menu-item-etnia-latino-americana" id="item-menu-etnia-latino-americana" value={'Etnia Latino-Americana'} >
                            {"Etnia Latino-Americana"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-etnia-africana" id="item-menu-etnia-africana" value={'Etnia Africana'} >
                            {"Etnia Africana"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-etnia-rus" id="item-menu-etnia-rus" value={'Etnia Rus'} >
                            {"Etnia Rus"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-etnia-cinese" id="item-menu-etnia-cinese" value={'Etnia Cinese'} >
                            {"Etnia Cinese"}
                        </MenuItem>
                        <MenuItem key="key-menu-item-altro" id="item-menu-etnia-altro" value={'Altro'} >
                            {"Altro"}
                    </MenuItem>
                    
                    </Select>
                    </FormControl>
            </Grid>
            <Grid item xs={12}>
                <RadioButtonsGroup
                    name="gender"
                    value={state.gender}
                    values={[
                        { value: "male", label: strings.general.male, color: 'primary' },
                        { value: "female", label: strings.general.female, color: 'secondary' }
                    ]}
                    onChange={handleGenderChange}
                />

                <CheckboxComponent
                    label={strings.general.consent}
                    name="consent"
                    checked={state.consent}
                    onChange={handleSwitchChange}
                />
            </Grid>
            <Grid item xs={12}>
                <ButtonGroup variant="contained">
                    <Button
                        disabled
                        //variant="outlined"
                        //color="default"
                        //size="small"
                        onClick={handleBackClick}
                        startIcon={<ArrowBackIosIcon />}
                    //style={{ margin: 8 }}
                    >
                        {strings.general.back}
                    </Button>
                    <Button
                        disabled={!state.consent}
                        //variant="contained"
                        //color="primary"
                        //size="small"
                        onClick={handleNextClick}
                        endIcon={<ArrowForwardIosIcon />}
                    //style={{ margin: 8 }}
                    >
                        {strings.general.next}
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>

    )
}

PersonalData.propTypes = {
    pageName: PropTypes.string,
    visit: PropTypes.string,
}

PersonalData.defaultProps = {
    pageName: strings.visit.steps.data_patient,
    visit: "first",
}
