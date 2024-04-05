import { Dialog, Switch, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { ChatListInterface, UserInterface } from "../../interfaces";
import { requestHandler } from "../../utils";
import { createGroupChat, createUserChat, getAvailableUsers } from "../../api";
import { UserGroupIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Select from "./Select";

const AddChatModal: React.FC<{
    open: boolean,
    onClose: () => void,
    onSuccess: (chat: ChatListInterface) => void
}> = ({ open, onClose, onSuccess }) => {
    // State to store the list of users, initialized as an empty array
    const [users, setUsers] = useState<UserInterface[]>([]);
    // State to store the name of a group, initilized as an empty string
    const [groupName, setGroupName] = useState("");
    // State to determine if the chat is group chat or not
    const [isGroupChat, setIsGroupChat] = useState(false);
    //State to store group participants
    const [groupParticipants, setGroupParticipants] = useState<string[]>([]);
    // State to store the ID of a selected user
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    // State to determine if a chat is currently being created
    const [creatingChat, setCreatingChat] = useState(false);

    // Function to fetch users 
    const getUsers = async () => {
        // Handle the request to get available users
        requestHandler(
            async () => await getAvailableUsers(),
            null,
            (res) => {
                const { data } = res;
                setUsers(data || []);
            },
            alert
        );
    };

    // Function to create new one on one chat
    const createNewChat = async () => {
        // If no user is selected, show an alert
        if (!selectedUserId) return alert("Please select a user");

        //Request handler to create a chat
        await requestHandler(
            async () => await createUserChat(selectedUserId),
            setCreatingChat,
            (res) => {
                const { data } = res;
                if (res.statusCode === 200) {
                    alert("Chat with selected user already exists");
                    return;
                }
                onSuccess(data);
                handleClose();
            },
            alert
        );
    };

    // Function to create new group chat
    const createNewGroupChat = async () => {
        // Check if a group name is provided
        if (!groupName) return alert("Grou name required");
        // Check if there are atleast 2 group participants
        if (!groupParticipants.length || groupParticipants.length < 2)
            return alert("Please select atleast 2 participants");

        //Request handler to create a group chat
        await requestHandler(
            async () => await createGroupChat(groupName, groupParticipants),
            setCreatingChat,
            (res) => {
                const { data } = res;

                onSuccess(data);
                handleClose();
            },
            alert
        );
    };

    // Function to reset local state and close modal
    const handleClose = () => {
        setUsers([]);
        setSelectedUserId("");
        setGroupName("");
        setGroupParticipants([]);
        setIsGroupChat(false);

        onClose();
    }

    useEffect(() => {
        if (!open) return;
        getUsers();
    }, [open]);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 " />
                </Transition.Child>
                <div className="fixed inset-0 z-10 overflow-y-visible">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 "
                            enterTo="opacity-100 translate-y-0 sm:scale-95"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-x-hidden rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transition-all bg-zinc-400 sm:my-8 sm:w-full sm:max-w-3xl sm:p-6"
                                style={{
                                    overflow: "inherit",
                                }}
                            >
                                <div>
                                    <div className="flex justify-between items-center">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold leading-6 text-white"
                                        >
                                            Create chat
                                        </Dialog.Title>
                                        <button
                                            className="rounded-md bg-transparent text-white hover:text-zinc-600"
                                            type="button"
                                            onClick={() => handleClose()}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <Switch.Group as="div" className="flex items-center my-5">
                                        <Switch
                                            checked={isGroupChat}
                                            onChange={setIsGroupChat}
                                            className={`${isGroupChat ? 'bg-gray-300' : 'bg-zinc-200'} relative outline outline-[1px] outline-white inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-0`}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`${isGroupChat ? 'translate-x-5 bg-green-500' : 'translate-x-0 bg-white'} pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out`}
                                            ></span>
                                        </Switch>
                                        <Switch.Label as="span" className="ml-3 text-sm">
                                            <span
                                                className={`${isGroupChat ? '' : 'opacity-40'} font-medium text-white`}
                                            >
                                                Is it a group chat ?
                                            </span>{" "}
                                        </Switch.Label>
                                    </Switch.Group>
                                    {isGroupChat ? (
                                        <div className="my-5">
                                            <input
                                                placeholder="Enter a group name..."
                                                value={groupName}
                                                onChange={(e) => {
                                                    setGroupName(e.target.value)
                                                }}
                                                className="block w-full rounded-xl outline outline-[1px] outline-zinc-400 border-0 py-4 px-5 bg-zinc-600 text-white font-light placeholder:text-white/70"
                                            />
                                        </div>
                                    ) : null}
                                    <div className="my-5">
                                        <Select
                                            placeholder={
                                                isGroupChat
                                                    ? "Select group participants..."
                                                    : "Select user to chat"
                                            }

                                            value={isGroupChat ? "" : selectedUserId || ""}
                                            options={users.map((user) => {
                                                return {
                                                    label: user.username,
                                                    value: user._id,
                                                };
                                            })}
                                            onChange={({ value }) => {
                                                if (isGroupChat && !groupParticipants.includes(value)) {
                                                    setGroupParticipants([...groupParticipants, value])
                                                } else {
                                                    setSelectedUserId(value)
                                                }
                                            }}
                                        />
                                    </div>
                                    {isGroupChat ? (
                                        <div className="my-5">
                                            <span className="font-medium text-white inline-flex items-center">
                                                <UserGroupIcon className="h-5 w-5 mr-2" /> Selected participants
                                            </span>{" "}
                                            <div className="flex justify-start items-center flex-wrap gap-2 mt-3">
                                                {users
                                                    .filter((user) => 
                                                        groupParticipants.includes(user._id)
                                                    )
                                                    ?.map((participant) => {
                                                        return (
                                                            <div
                                                                key={participant._id}
                                                                className="inline-flex bg-zinc-400 rounded-full p-2 border-[1px] border-zinc-400 items-center gap-2"
                                                            >
                                                                <img 
                                                                    src={participant.avatar} 
                                                                    className="h-6 w-6 rounded-full object-cover"
                                                                />
                                                                <p className="text-white">{participant.username}</p>
                                                                <XCircleIcon
                                                                    role="button"
                                                                    className="w-6 h-6 hover:text-blue-400 cursor-pointer"
                                                                    onClick={() => {
                                                                        setGroupParticipants(
                                                                            groupParticipants.filter(
                                                                                (p) => p !== participant._id
                                                                            )
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </div>
                                    ): null}
                                </div>
                                <div>
                                    <button 
                                        disabled={creatingChat}
                                        onClick={handleClose}
                                        className="w-1/2 rounded-full inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm bg-gray-600 hover:bg-gray-400/80 disabled:bg-secondary/50 text-base px-4 py-3"
                                    >
                                        Close
                                    </button>
                                    <button 
                                        disabled={creatingChat}
                                        onClick={isGroupChat ? createNewGroupChat : createNewChat}
                                        className="w-1/2 rounded-full inline-flex flex-shrink-0 justify-center items-center text-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shadow-sm bg-green-600 hover:bg-green-600/80 disabled:bg-green-600/50 text-base px-4 py-3"
                                    >
                                        Create
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default AddChatModal