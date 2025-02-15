/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Course } from "./interfaces/course";
import { updateCourse, DeleteCourseFromSemester } from "./DBmanage";
import { dbMangement } from "./interfaces/semester";
import { DeleteCourseModal } from "./DeleteCourseModal";

export const EditCourseModal = ({
    show,
    handleClose,
    currentCourse,
    updateCoursePass,
    dbManager
}: {
    show: boolean;
    handleClose: () => void;
    currentCourse: Course;
    updateCoursePass: (courseSet: Course) => void;
    dbManager: dbMangement;
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const initialCourseRef = useRef<Course | null>(null);

    const [ticker, setTicker] = useState<string>(currentCourse.ticker);
    const [name, setName] = useState<string>(currentCourse.name);
    const [credits, setCredits] = useState<number>(currentCourse.credits);
    const [prereq, setPrereq] = useState<string>(currentCourse.prereq);
    useEffect(() => {
        if (show) {
            //Check if initial course ref isnt set or if its different from current course
            if (
                !initialCourseRef.current ||
                initialCourseRef.current.UUID !== currentCourse.UUID
            ) {
                initialCourseRef.current = { ...currentCourse }; //Updates inital course ref to current course
            }

            setTicker(currentCourse.ticker);
            setName(currentCourse.name);
            setCredits(currentCourse.credits);
            setPrereq(currentCourse.prereq);
        }
    }, [show, currentCourse]);
    //Reverts changes made to a course
    const revertChanges = () => {
        if (initialCourseRef.current) {
            //Checks if there is an initial course ref
            const initialCourse = initialCourseRef.current; //Gets the inital course
            setTicker(initialCourse.ticker);
            setName(initialCourse.name);
            setCredits(initialCourse.credits);
            setPrereq(initialCourse.prereq);
        }
    };
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
                    <Button variant="warning" onClick={revertChanges}>
                        Revert
                    </Button>
                    <Button variant="primary" onClick={saveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
