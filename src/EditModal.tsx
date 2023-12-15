/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Course } from "./interfaces/course";
import { updateCourse } from "./DBmanage";
import { dbMangement } from "./interfaces/semester";

export const EditCourseModal = ({
    show,
    handleClose,
    currentCourse,
    updateCoursePass
}: {
    show: boolean;
    handleClose: () => void;
    currentCourse: Course;
    updateCoursePass: (courseSet: Course) => void;
}) => {
    const [ticker, setTicker] = useState<string>(currentCourse.ticker);
    const [name, setName] = useState<string>(currentCourse.name);
    const [credits, setCredits] = useState<number>(currentCourse.credits);
    const [prereq, setPrereq] = useState<string>(currentCourse.prereq);
    useEffect(() => {
        setTicker(currentCourse.ticker);
        setName(currentCourse.name);
        setCredits(currentCourse.credits);
        setPrereq(currentCourse.prereq);
    }, [currentCourse]);

    const saveChanges = () => {
        // updateCourse(
        //     cRUD,
        //     { ticker: ticker, name: name, credits: credits, prereq: prereq },
        //     currentCourse.UUID!
        // );
        updateCoursePass({
            ticker: ticker,
            name: name,
            credits: credits,
            prereq: prereq,
            UUID: currentCourse.UUID
        });
        console.log("current Course");
        console.log(currentCourse.UUID);
        handleClose();
    };
    // const handleDelete = () => {
    //     deleteCourse(cRUD, currentCourse.ticker);
    //     handleClose();
    // };
    return (
        <div>
            <Modal show={show} onHide={handleClose} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formQuizId">
                        <Form.Label>Name: </Form.Label>
                        <Form.Control
                            value={name}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setName(e.target.value)}
                        ></Form.Control>
                        <Form.Label>Ticker: </Form.Label>
                        <Form.Control
                            value={ticker}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setTicker(e.target.value)}
                        ></Form.Control>
                        <Form.Label>Credits: </Form.Label>
                        <Form.Control
                            value={credits}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setCredits(Number(e.target.value))}
                        ></Form.Control>
                        <Form.Label>
                            prereq:(Use codes seperated by &quot;and&quot; or
                            &quot;or&quot;){" "}
                        </Form.Label>
                        <Form.Control
                            value={[prereq]}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setPrereq(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* <Button variant="danger" onClick={handleDelete}>
                        Delete Course
                            </Button> */}
                    <Button variant="primary" onClick={saveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
