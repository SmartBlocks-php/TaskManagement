<?php
/**
 * Date: 12/03/2013
 * Time: 11:28
 * This is the model class called File
 */
namespace TaskManagement;
/**
 * @Entity @Table(name="task_management_tasks")
 */
class Task extends \Model {
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @Column(type="string")
     */
    private $name;

    /**
     * @Column(type="text")
     */
    private $description;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $owner;

    /**
     * @Column(type="text")
     */
    private $data;

    /**
     * @ManyToMany(targetEntity="\User")
     */
    private $participants;

    /**
     * @ManyToMany(targetEntity="\Time\Event")
     */
    private $events;

    public function __construct() {
        $this->data = json_encode(array());
        $this->description = "";
        $this->participants = new \Doctrine\Common\Collections\ArrayCollection();
        $this->events = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getId() {
        return $this->id;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function getName() {
        return $this->name;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

    public function getDescription() {
        return $this->description;
    }

    public function setOwner($owner) {
        $this->owner = $owner;
    }

    public function getOwner() {
        return $this->owner;
    }

    public function getData() {
        return json_decode($this->data, true);
    }

    public function setData($data) {
        $this->data = json_encode($data);
    }

    /**
     * @param \User[] $participants
     */
    public function setParticipants($participants) {
        $this->participants = $participants;
    }

    /**
     * @return \User[]
     */
    public function getParticipants() {
        return $this->participants;
    }

    /**
     * @param mixed $events
     */
    public function setEvents($events) {
        $this->events = $events;
    }

    /**
     * @return mixed
     */
    public function getEvents() {
        return $this->events;
    }

    public function toArray() {

        $participants = array();

        foreach ($this->participants as $p) {
            $participants[] = $p->toArray();
        }

        $events = array();

        foreach ($this->events as $e) {
            $events[] = $e->toArray();
        }

        $array = array(
            "id" => $this->id,
            "name" => $this->name,
            "description" => $this->description,
            "owner" => $this->getOwner() != null ? $this->getOwner()->toArray() : null,
            "participants" => $participants,
            "events" => $events
        );

        $data = $this->getData();
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $array[$key] = $value;
            }
        }

        return $array;
    }

    public function save() {
        parent::save();
        foreach ($this->getParticipants() as $participant) {
            \NodeDiplomat::sendMessage($participant->getSessionId(), array(
                    "block" => "TaskManagement",
                    "action" => "saved_task",
                    "task" => $this->toArray()
                )
            );
        }
    }

    function delete() {
        foreach ($this->getParticipants() as $participant) {
            \NodeDiplomat::sendMessage($participant->getSessionId(), array(
                    "block" => "TaskManagement",
                    "action" => "deleted_task",
                    "task" => $this->toArray()
                )
            );
        }
        \NodeDiplomat::sendMessage($this->getOwner()->getSessionId(), array(
                "block" => "TaskManagement",
                "action" => "deleted_task",
                "task" => $this->toArray()
            )
        );
        parent::delete();
    }
}