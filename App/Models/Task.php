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
class Task extends \Model
{
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


    public function __construct()
    {
        $this->data = json_encode(array());
    }

    public function getId()
    {
        return $this->id;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setOwner($owner)
    {
        $this->owner = $owner;
    }

    public function getOwner()
    {
        return $this->owner;
    }

    public function getData()
    {
        return json_decode($this->data, true);
    }

    public function setData($data)
    {
        $this->data = json_encode($data);
    }


    public function toArray()
    {

        $array = array(
            "id" => $this->id,
            "name" => $this->name,
            "description" => $this->description,
            "owner" => $this->getOwner() != null ? $this->getOwner()->toArray() : null
        );

        $data = $this->getData();
        if (is_array($data))
        {
            foreach ($data as $key => $value)
            {
                $array[$key] = $value;
            }
        }

        return $array;
    }
}